import { useState } from 'react';
import { List, ListItem, ListItemText, TextField, Button, Box } from '@mui/material';
import type { MessageResponse, MessageCreate } from '../../types/api';

interface ChatWindowProps {
  messages: MessageResponse[];
  onSend: (data: MessageCreate) => void;
}

const ChatWindow = ({ messages, onSend }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage) {
      onSend({ content: newMessage });
      setNewMessage('');
    }
  };

  return (
    <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <List sx={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((msg) => (
          <ListItem key={msg.id}>
            <ListItemText primary={msg.content} secondary={new Date(msg.created_at).toLocaleString()} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex' }}>
        <TextField value={newMessage} onChange={(e) => setNewMessage(e.target.value)} fullWidth />
        <Button onClick={handleSend} variant="contained">Send</Button>
      </Box>
    </Box>
  );
};

export default ChatWindow;