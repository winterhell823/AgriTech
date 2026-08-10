import { useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { sendChatMessage } from '../../services/chatService';

export function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Ask about crop stress, phenology, or field recommendations.' },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const quickPrompts = useMemo(
    () => ['Why is field 1024 high priority?', 'Show moisture stress rationale', 'What is the wheat stage?'],
    [],
  );

  const submit = async (value = input) => {
    if (!value.trim()) {
      return;
    }

    const userMessage = { role: 'user', text: value };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setSending(true);
    const response = await sendChatMessage(value);
    setMessages((current) => [...current, { role: 'assistant', text: response.reply, sources: response.sources }]);
    setSending(false);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SmartToyOutlinedIcon color="primary" />
          <Typography variant="h6">AI Assistant</Typography>
        </Stack>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 340 }} className="soft-scrollbar">
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={`${message.role}-${index}`}
                sx={{
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  textAlign: message.role === 'user' ? 'right' : 'left',
                }}
              >
                <Card sx={{ maxWidth: '82%', bgcolor: message.role === 'user' ? 'rgba(47,107,63,0.1)' : 'rgba(22,48,37,0.04)' }}>
                  <CardContent sx={{ py: 1.25 }}>
                    <ListItemText
                      primary={message.text}
                      secondary={message.sources ? `Sources: ${message.sources.join(', ')}` : null}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {quickPrompts.map((prompt) => (
            <Chip key={prompt} label={prompt} onClick={() => submit(prompt)} />
          ))}
        </Stack>

        <Divider />

        <Stack direction="row" spacing={1}>
          <TextField fullWidth multiline minRows={2} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question about the validated outputs..." />
          <Button variant="contained" disabled={sending} onClick={() => submit()} startIcon={<SendOutlinedIcon />}>
            Send
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}