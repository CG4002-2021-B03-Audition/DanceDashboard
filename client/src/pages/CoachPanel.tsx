import { Avatar } from '@chakra-ui/avatar'
import { Container, Text } from '@chakra-ui/layout'
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/slider'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs'
import React, { useState } from 'react'
import Dancer1 from '../images/dancer1.png'
import Dancer2 from '../images/dancer2.png'
import Dancer3 from '../images/dancer3.png'
import SensorPanel from './SensorPanel'

interface Props {}

const CoachPanel: React.FC<Props> = () => {
    const [size, setSize] = useState(10)
    const [avatarSize, setAvatarSize] = useState(["lg", "md", "md"])

    return (
        <>
            <Tabs
                ml={4} 
                mr={4} 
                orientation="horizontal" 
                isFitted variant="unstyled" 
                colorScheme="purple"
            >
                <TabList mb="1em">
                    <Tab onClick={()=>setAvatarSize(["lg", "md", "md"])}>
                        <Avatar size={avatarSize[0]} bg="purple.200" name="Dancer1" src={Dancer1}/>
                    </Tab>
                    <Tab onClick={()=>setAvatarSize(["md", "lg", "md"])}>
                        <Avatar size={avatarSize[1]} bg="purple.200" name="Dancer2" src={Dancer2}/>
                    </Tab>
                    <Tab onClick={()=>setAvatarSize(["md", "md", "lg"])}>
                        <Avatar size={avatarSize[2]} bg="purple.200" name="Dancer3" src={Dancer3}/>
                    </Tab>
                </TabList>
                <Container centerContent>
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
                <TabPanels>
                    <TabPanel>
                        <SensorPanel dancerId={0} dataSize={size}/>        
                    </TabPanel>
                    <TabPanel>
                        <SensorPanel dancerId={1} dataSize={size}/>
                    </TabPanel>
                    <TabPanel>
                        <SensorPanel dancerId={2} dataSize={size}/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export default CoachPanel