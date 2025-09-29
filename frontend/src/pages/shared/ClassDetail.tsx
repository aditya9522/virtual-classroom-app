import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Stack } from '@mui/material';
import ChatWindow from '../../components/class/ChatWindow';
import VideoPlayer from '../../components/class/VideoPlayer';
import { fetchClassByIdThunk } from '../../features/classes/classesThunks';
import { fetchEnrollmentsThunk, enrollThunk, unenrollThunk } from '../../features/enrollments/enrollmentsThunks';
import { sendMessage, getMessages } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useAuth } from '../../hooks/useAuth';
import type { RootState } from '../../store';
import type { MessageCreate, MessageResponse } from '../../types/api';
import { toast } from 'react-toastify';

const ClassDetail = () => {
  const { classId } = useParams<{ classId: string }>();
  const id = Number(classId);
  const { user } = useAuth();
  const classData = useSelector((state: RootState) => state.classes.classes[0]);
  const enrollments = useSelector((state: RootState) => state.enrollments.enrollments);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const ws = useWebSocket(id, (data) => {
    if (data.type === 'offer' || data.type === 'answer' || data.type === 'candidate') {
      peer?.signal(data.signal);
    } else if (data.type === 'new-message') {
      setMessages((prev) => [...prev, data.message]);
    }
  });

  const onRemoteStream = useCallback((stream: MediaStream) => {
    setRemoteStreams((prev) => [...prev, stream]);
  }, []);

  const onSignal = useCallback((signal: any) => {
    ws?.send(JSON.stringify({ type: 'signal', signal }));
  }, [ws]);

  const { peer } = useWebRTC(
    localStream,
    user?.role === 'teacher',
    onRemoteStream,
    onSignal
  );

  useEffect(() => {
    dispatch(fetchClassByIdThunk(id) as any);
    dispatch(fetchEnrollmentsThunk(id) as any);

    const fetchMsgs = async () => {
      const msgs = await getMessages(id);
      setMessages(msgs);
    };
    fetchMsgs();

    setIsEnrolled(enrollments.some((e) => e.student_id === user?.id));
  }, [id, dispatch, user, enrollments]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      ws?.send(JSON.stringify({ type: 'start' }));
    } catch (err) {
      toast.error('Failed to start video.');
    }
  };

  const joinVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      ws?.send(JSON.stringify({ type: 'join' }));
    } catch (err) {
      toast.error('Failed to join video.');
    }
  };

  const handleSendMessage = async (data: MessageCreate) => {
    const msg = await sendMessage(id, data);
    setMessages((prev) => [...prev, msg]);
    ws?.send(JSON.stringify({ type: 'new-message', message: msg }));
  };

  const handleEnroll = () => {
    dispatch(enrollThunk(id) as any);
    setIsEnrolled(true);
  };

  const handleUnenroll = () => {
    dispatch(unenrollThunk(id) as any);
    setIsEnrolled(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">{classData?.title}</Typography>
        <Typography>{classData?.description}</Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ flex: 2 }}>
          {user?.role === 'teacher' && (
            <Button variant="contained" sx={{ mb: 2 }} onClick={startVideo}>
              Start Video
            </Button>
          )}
          {user?.role === 'student' && (
            <Button variant="contained" sx={{ mb: 2 }} onClick={joinVideo}>
              Join Video
            </Button>
          )}
          <VideoPlayer stream={localStream} muted />
          {remoteStreams.map((stream, index) => (
            <VideoPlayer key={index} stream={stream} />
          ))}
        </Box>

        <Box sx={{ flex: 1 }}>
          <ChatWindow messages={messages} onSend={handleSendMessage} />
        </Box>
      </Stack>

      {user?.role === 'student' && (
        <Box sx={{ mt: 3 }}>
          {isEnrolled ? (
            <Button variant="contained" color="error" onClick={handleUnenroll}>
              Unenroll
            </Button>
          ) : (
            <Button variant="contained" onClick={handleEnroll}>
              Enroll
            </Button>
          )}
        </Box>
      )}

      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Enrollments
          </Typography>
          <Stack spacing={1}>
            {enrollments.map((e) => (
              <Box key={e.id} sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
                Student {e.student_id} - Enrolled at {e.enrolled_at}
              </Box>
            ))} 
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ClassDetail;
