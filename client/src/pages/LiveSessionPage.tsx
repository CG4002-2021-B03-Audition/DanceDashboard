import React from 'react';
import Layout from '../components/Layout/Layout';
import DelayChart from '../containers/DelayChart';
import { Stack, ButtonGroup, Button, Container } from '@chakra-ui/react';
import { moveSocket } from '../socket'
import MoveTable from '../containers/MoveTable';
import DancePositions from '../containers/DancePositions';
import MovePredictionChart from '../containers/MovePredictionChart';
import AdvancedStatsDrawer from '../containers/AdvancedStatsDrawer';

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
                    <AdvancedStatsDrawer/>
                </ButtonGroup>
            </Container>
            <Stack isInline={true} 
                m={8} 
                p ={4}
            >   
                <Container 
                    border="1px" 
                    borderColor="gray.100" 
                    rounded="md" 
                    centerContent 
                    bgGradient="linear(purple.200 0%, white 70%)"
                >
                    <DancePositions/>
                </Container>
                <Container 
                    centerContent  
                >
                    <MovePredictionChart/>
                </Container>
            </Stack>
            <Stack isInline={true} 
                border="1px" 
                borderColor="gray.100" 
                rounded="md" 
                m={8} 
                p ={4}
            >
                <Container>
                    <DelayChart/>   
                </Container>
                <Container h={96} overflowY="auto" centerContent>
                    <MoveTable/>
                </Container>
            </Stack>
        </Layout>
    )
}

export default LiveSessionPage;