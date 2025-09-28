import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routes.auth import router as auth_router
from app.routes.enrollments import router as enrollment_router
from app.routes.classes import router as classes_router
from app.routes.messages import router as messages_router
from app.routes.ws import router as ws_router
from app.ws.manager import manager as ws_manager
from app.core.config import settings

app = FastAPI(title='Virtual Classroom Backend')

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event('startup')
async def on_startup():
    try:
        await init_db()
        print("Database initialized successfully.")

        async def on_pubsub_message(room_id: str, data: dict):
            await ws_manager.local_broadcast(room_id, data)

        await ws_manager.init_redis(on_pubsub_message)
        print("Redis pub/sub initialized successfully.")
    except Exception as e:
        print(f"Startup failed: {str(e)}")
        raise


app.include_router(auth_router)
app.include_router(enrollment_router)
app.include_router(classes_router)
app.include_router(messages_router)
app.include_router(ws_router)


@app.get('/health', response_model=dict)
async def health():
    return {'status': 'ok'}

if __name__ == '__main__':
    uvicorn.run('app.main:app', host='0.0.0.0', port=8000, reload=True)
