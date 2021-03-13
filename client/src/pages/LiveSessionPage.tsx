import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import DelayChart from '../containers/DelayChart';
import { Stack, ButtonGroup, Button, Container, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from '@chakra-ui/react';
import { moveSocket } from '../socket'
import MoveTable from '../containers/MoveTable';
import DancePositions from '../containers/DancePositions';
import MovePredictionChart from '../containers/MovePredictionChart';
import AdvancedStatsDrawer from '../containers/AdvancedStatsDrawer';
import SensorChart from '../containers/SensorChart';

const LiveSessionPage: React.FC = () => {
    const handleConnect = () => {
        moveSocket.connect()
    }

    const handleDisconnect = () => {
        moveSocket.disconnect()
    }

    const [size, setSize] = useState(10)
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

            <Container>
                <Text>{size}</Text>
                <Slider 
                    aria-label="slider-ex-1" 
                    value={size} 
                    min={10}
                    max={250}
                    step={1}
                    onChange={(value : any) => setSize(value)}
                    focusThumbOnChange={false}
                    colorScheme="purple"
                >
                    <SliderTrack>
                        <SliderFilledTrack/>
                    </SliderTrack>
                    <SliderThumb/>
                </Slider>
            </Container>

            <Stack isInline={true} 
                border="1px" 
                borderColor="gray.100" 
                rounded="md" 
                m={8} 
                p ={4}
            >
                <Container>
                    <SensorChart dancerId={1} datapoint="x" size={size}/>           
                </Container>
                <Container>
                    <SensorChart dancerId={1} datapoint="y" size={size}/>        
                </Container>
                <Container>
                    <SensorChart dancerId={1} datapoint="z" size={size}/>
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
                    <SensorChart dancerId={1} datapoint="yaw" size={size}/>        
                </Container>
                <Container>
                    <SensorChart dancerId={1} datapoint="pitch" size={size}/>        
                </Container>
                <Container>
                    <SensorChart dancerId={1} datapoint="roll" size={size}/>
                </Container>
            </Stack>
        </Layout>
    )
}

export default LiveSessionPage;