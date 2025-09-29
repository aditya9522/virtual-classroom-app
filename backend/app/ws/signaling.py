from fastapi import WebSocket, status
from jose import jwt, JWTError
from typing import Any
from app.core.config import settings
from app.ws.manager import manager
from app.database import get_session
from app.services.messages import save_message

async def handle_websocket(websocket: WebSocket, class_id: str, user):
    try:
        user_id = int(getattr(user, 'id'))
    except Exception:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await manager.connect(class_id, websocket, user_id)
    await manager.broadcast(class_id, {'type': 'presence', 'payload': {'event': 'join', 'userId': user_id}}, exclude=websocket)

    try:
        async for raw in websocket.iter_json():
            if not isinstance(raw, dict):
                continue
            msg_type = raw.get('type')
            payload = raw.get('payload', {})

            if msg_type == 'chat':
                content = payload.get('content', '').strip()
                if content:
                    async for session in get_session():
                        message = await save_message(session, int(class_id), user_id, content)
                        await manager.broadcast(class_id, {'type': 'chat', 'payload': message.dict()})
                        break
                continue

            if msg_type in {'webrtc-offer', 'webrtc-answer', 'webrtc-candidate', 'join'}:
                await manager.broadcast(class_id, {'type': msg_type, 'payload': {**payload, 'senderId': user_id}}, exclude=websocket)
                continue
    except Exception:
        pass
    finally:
        manager.disconnect(class_id, websocket)
        await manager.broadcast(class_id, {'type': 'presence', 'payload': {'event': 'leave', 'userId': user_id}})