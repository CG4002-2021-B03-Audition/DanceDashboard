import { Grid, GridItem } from '@chakra-ui/layout'
import React from 'react'
import SensorChart from '../containers/SensorChart'

interface Props {
    dataSize: number
    dancerId: number
}

const SensorPanel: React.FC<Props> = (props) => {
    return (
        <Grid  
            border="1px" 
            borderColor="gray.100" 
            templateRows="repeat(1)"
            templateColumns="repeat(3, 1fr)"
            rounded="md" 
            maxWidth="100%"
            m={8} 
            p ={4}
        >
            <GridItem colSpan={3}>Accelerometer Readings</GridItem>
            {["x", "y", "z"].map((datapoint : any) => {
                return (
                    <GridItem colSpan={1} key={datapoint}>
                        <SensorChart dancerId={props.dancerId} datapoint={datapoint} size={props.dataSize}/>           
                    </GridItem>
                )
            })}
            <GridItem colSpan={3}>Gyroscope Readings</GridItem>
            {["yaw", "pitch", "roll"].map((datapoint : any) => {
                return (
                    <GridItem colSpan={1}>
                        <SensorChart dancerId={props.dancerId} datapoint={datapoint} size={props.dataSize}/>           
                    </GridItem>
                )
            })}
            
        </Grid>
    )
}

export default SensorPanel;