import { useRef, useEffect } from 'react';
import { Box } from '@mui/material';

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
}

const VideoPlayer = ({ stream, muted = false }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Box>
      <video ref={videoRef} autoPlay playsInline muted={muted} style={{ width: '100%' }} />
    </Box>
  );
};

export default VideoPlayer;