import { Container, Stack, Text } from '@chakra-ui/layout'
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/slider'
import React, { useState } from 'react'
import ModalComponent from '../components/Modal/ModalComponent'
import SensorChart from './SensorChart'

interface Props {
    onClose: any
    isOpen: boolean
    modalTitle: string
}

const AdvancedStatsModal: React.FC<Props> = (props) => {
    const [size, setSize] = useState(10)
    return (
        <ModalComponent
            isOpen={props.isOpen}
            onClose={props.onClose}
            modalTitle={props.modalTitle}
        >
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
        </ModalComponent>

    )
}

export default AdvancedStatsModal