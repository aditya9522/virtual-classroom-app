import { useRef, useEffect } from 'react';
import SimplePeer from 'simple-peer';

export const useWebRTC = (stream: MediaStream | null, initiator: boolean, onStream: (stream: MediaStream) => void, onSignal: (signal: any) => void) => {
  const peerRef = useRef<SimplePeer.Instance | null>(null);

  useEffect(() => {
    if (!stream) return;
    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream,
    });
    peer.on('signal', onSignal);
    peer.on('stream', onStream);
    peerRef.current = peer;

    return () => peer.destroy();
  }, [stream, initiator, onSignal, onStream]);

  return { peer: peerRef.current, signal: (data: any) => peerRef.current?.signal(data) };
};