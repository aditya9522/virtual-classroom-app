import { useEffect, useState } from 'react';

export const useWebSocket = (classId: number | undefined, onMessage: (data: any) => void) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!classId) return;
    const token = localStorage.getItem('token');
    const url = `ws://localhost:8000/ws/${classId}?token=${token}`; // wss in prod
    const websocket = new WebSocket(url);
    websocket.onopen = () => console.log('WS connected');
    websocket.onmessage = (event) => onMessage(JSON.parse(event.data));
    websocket.onclose = () => console.log('WS closed');
    setWs(websocket);

    return () => websocket.close();
  }, [classId, onMessage]);

  return ws;
};