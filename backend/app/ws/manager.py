from typing import Dict
from fastapi import WebSocket
from .redis_manager import redis_pubsub

class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, Dict[WebSocket, int]] = {}  # room_id -> {websocket: user_id}

    async def init_redis(self, on_pubsub_message):
        await redis_pubsub.connect(on_pubsub_message)

    async def connect(self, room_id: str, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active.setdefault(room_id, {})[websocket] = user_id

        # Send current active users to the new connection
        for other_ws, other_id in list(self.active[room_id].items()):
            if other_ws != websocket:
                await websocket.send_json({'type': 'presence', 'payload': {'event': 'join', 'userId': other_id}})

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.active:
            user_id = self.active[room_id].pop(websocket, None)
            if not self.active[room_id]:
                del self.active[room_id]
            return user_id
        return None

    async def local_broadcast(self, room_id: str, message: dict, exclude: WebSocket = None):
        if room_id not in self.active:
            return
        living = {}
        for ws, uid in list(self.active[room_id].items()):
            if ws == exclude:
                living[ws] = uid
                continue
            try:
                await ws.send_json(message)
                living[ws] = uid
            except Exception:
                pass
        self.active[room_id] = living

    async def broadcast(self, room_id: str, message: dict, exclude: WebSocket = None):
        await self.local_broadcast(room_id, message, exclude=exclude)
        await redis_pubsub.publish(room_id, message)

manager = ConnectionManager()