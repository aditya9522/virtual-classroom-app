from typing import Dict, List
from fastapi import WebSocket
from .redis_manager import redis_pubsub

class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, List[WebSocket]] = {}

    async def init_redis(self, on_pubsub_message):
        await redis_pubsub.connect(on_pubsub_message)

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active.setdefault(room_id, []).append(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.active and websocket in self.active[room_id]:
            self.active[room_id].remove(websocket)
            if not self.active[room_id]:
                del self.active[room_id]

    async def local_broadcast(self, room_id: str, message: dict, exclude: WebSocket = None):
        if room_id not in self.active:
            return
        living = []
        for ws in list(self.active[room_id]):
            if ws == exclude:
                continue
            try:
                await ws.send_json(message)
                living.append(ws)
            except Exception:
                pass
        self.active[room_id] = living

    async def broadcast(self, room_id: str, message: dict, exclude: WebSocket = None):
        await self.local_broadcast(room_id, message, exclude=exclude)
        await redis_pubsub.publish(room_id, message)

manager = ConnectionManager()