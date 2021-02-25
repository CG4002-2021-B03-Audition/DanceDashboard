import React from 'react';
import Layout from '../components/Layout/Layout';
import DelayChart from '../containers/DelayChart';
import { Stack, ButtonGroup, Button, Container } from '@chakra-ui/react';
import MoveAccuracyChart from '../containers/MoveAccuracyChart';
import { moveSocket } from '../socket'
import MoveTable from '../containers/MoveTable';
import DancePositions from '../containers/DancePositions';

const LiveSessionPage: React.FC = () => {
    const handleConnect = () => {
        moveSocket.connect()
    }

    const handleDisconnect = () => {
        moveSocket.disconnect()
    }
    return (
        <Layout>
            <Container centerContent>
                <ButtonGroup>
                    <Button onClick={handleConnect}>Start dance session!</Button>
                    <Button onClick={handleDisconnect}>Stop dance session!</Button>
                </ButtonGroup>
            </Container>
            <Stack isInline={true} 
                border="1px" 
                borderColor="gray.100" 
                rounded="md" 
                m={8} 
                p ={4}
            >   
                <Container centerContent >
                    <DancePositions/>
                </Container>
                <Container centerContent >
                    <MoveAccuracyChart/>
                </Container>
            </Stack>
            <Stack isInline={true} 
                border="1px" 
                borderColor="gray.100" 
                rounded="md" 
                m={8} 
                p ={4}
            >
                <Container centerContent>
                    <DelayChart/>
                </Container>
                <Container centerContent>
                    <MoveTable/>
                </Container>
            </Stack>
        </Layout>
    )
}

export default LiveSessionPage;