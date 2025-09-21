from fastapi import APIRouter, WebSocket, Depends
from app.ws.signaling import handle_websocket
from app.deps import get_current_user_ws

router = APIRouter()

@router.websocket('/ws/{class_id}')
async def websocket_endpoint(websocket: WebSocket, class_id: str):
    await websocket.accept()
    user = await get_current_user_ws(websocket)
    if not user:
        await websocket.close(code=4401)
        return
    await handle_websocket(websocket, class_id, user)

