import asyncio
import json
import os
import redis.asyncio as redis
from typing import Callable, Awaitable
from app.core.config import settings

REDIS_URL = settings.REDIS_URL

class RedisPubSub:
    def __init__(self):
        self.redis = None
        self.pub = None
        self.sub = None
        self.loop_task = None

    async def connect(self, on_message: Callable[[str, dict], Awaitable[None]]):
        self.redis = redis.from_url(REDIS_URL, decode_responses=False)
        self.pub = self.redis
        self.sub = self.redis.pubsub()
        await self.sub.psubscribe("*")

        async def reader():
            async for message in self.sub.listen():
                if message["type"] == "pmessage":
                    try:
                        data = json.loads(message["data"])
                        channel = message["channel"].decode() if isinstance(message["channel"], bytes) else message["channel"]
                        await on_message(channel, data)
                    except Exception:
                        pass
        self.loop_task = asyncio.create_task(reader())

    async def publish(self, channel: str, data: dict):
        await self.pub.publish(channel, json.dumps(data))

    async def close(self):
        if self.loop_task:
            self.loop_task.cancel()
        if self.sub:
            await self.sub.close()
        if self.redis:
            await self.redis.close()

redis_pubsub = RedisPubSub()