import { Container, Stack, Text } from '@chakra-ui/layout'
import React from 'react'
import SensorChart from '../containers/SensorChart'

interface Props {
    dataSize: number
    dancerId: number
}

const SensorPanel: React.FC<Props> = (props) => {
    return (
        <>
            <Stack
                border="1px" 
                borderColor="gray.100" 
                rounded="md" 
                m={8} 
                p ={4}
            >
                <Text>Accelerometer Readings</Text>
                <Stack isInline={true}>
                    {["x", "y", "z"].map((datapoint : any) => {
                        return (
                            <Container key={datapoint}>
                                <SensorChart dancerId={props.dancerId} datapoint={datapoint} size={props.dataSize}/>           
                            </Container>
                        )
                    })}
                </Stack>
            </Stack>
            <Stack
                border="1px" 
                borderColor="gray.100" 
                rounded="md" 
                m={8} 
                p ={4}
            >
                <Text>Gyroscope Readings</Text>
                <Stack isInline={true} >
                    {["yaw", "pitch", "roll"].map((datapoint : any) => {
                        return (
                            <Container key={datapoint}>
                                <SensorChart dancerId={props.dancerId} datapoint={datapoint} size={props.dataSize}/>           
                            </Container>
                        )
                    })}
                </Stack>
            </Stack>
        </>
    )
}

export default SensorPanel;