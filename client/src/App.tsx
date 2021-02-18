import React from 'react';
import Layout from './components/Layout/Layout';
import DelayChart from './containers/DelayChart';
import TopBar from './components/Menu/TopBar';
import { Stack, ButtonGroup, Button, Container } from '@chakra-ui/react';
import MoveAccuracyChart from './containers/MoveAccuracyChart';
import { moveSocket } from './socket'
import MoveTable from './containers/MoveTable';

const App: React.FC = () => {
  const handleConnect = () => {
    moveSocket.connect()
  }

  const handleDisconnect = () => {
    moveSocket.disconnect()
  }
  return (
      <Layout>
        <TopBar/>
        <Container centerContent>
          <ButtonGroup>
              <Button onClick={handleConnect}>Start dance session!</Button>
              <Button onClick={handleDisconnect}>Stop dance session!</Button>
          </ButtonGroup>
        </Container>
        <Stack isInline={true}
          centerContent 
          border="1px" 
          borderColor="gray.100" 
          rounded="md" 
          m={8} 
          p ={4}
        >
          <Container centerContent>
            <DelayChart/>
          </Container>
          <Container centerContent >
              <MoveAccuracyChart/>
          </Container>
        </Stack>
        <Stack isInline={true}
          centerContent 
          border="1px" 
          borderColor="gray.100" 
          rounded="md" 
          m={8} 
          p ={4}
        >
          <Container centerContent>
            <MoveTable/>
          </Container>
        </Stack>
      </Layout>
  );
}

export default App;
