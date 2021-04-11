import { Container, Stack } from '@chakra-ui/layout'
import React from 'react'
import DancePositions from '../containers/DancePositions'
import DelayChart from '../containers/DelayChart'
import EMGChart from '../containers/EMGChart'
import MovePredictionChart from '../containers/MovePredictionChart'
import MoveTable from '../containers/MoveTable'

const DancerPanel: React.FC = () => {
    return (
        <>
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
                <Container h={96} overflowY="auto" centerContent>
                    <EMGChart/>
                </Container>
            </Stack>
        </>
    )
}

export default DancerPanel