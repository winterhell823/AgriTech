import { Box } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';
import { ChatAssistant } from '../components/chat/ChatAssistant';

export function AssistantPage() {
  return (
    <Box>
      <PageHeader title="AI Assistant" subtitle="Explanation and query layer, not the prediction engine" />
      <ChatAssistant />
    </Box>
  );
}