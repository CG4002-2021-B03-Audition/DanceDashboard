import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { Text } from '@chakra-ui/layout'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/progress'
import { Tooltip } from '@chakra-ui/tooltip'
import React from 'react'
import { useSelector } from 'react-redux'
import { getProgressColor } from '../utils'

const selectEmg = (state: any) => { 
    return state.liveStore.emg
}

const EMGChart = () => {
    const emgVal = useSelector(selectEmg)
    return (
        <CircularProgress value={ emgVal ? emgVal : 0} size={64} color={getProgressColor(emgVal)}>
            <CircularProgressLabel>
                <Tooltip label="Measures electrical signal from muscle contraction">
                    <QuestionOutlineIcon boxSize="0.8em"/>
                </Tooltip>
                <Text size="20" fontWeight="bold" fontSize={24} margin="auto" maxWidth="50%" noOfLines={2}>
                    Muscle Fatigue
                </Text>                       
                <Text fontSize={24}>
                    { emgVal ? emgVal.toFixed(1) : 0 }%
                </Text>
            </CircularProgressLabel>
        </CircularProgress>
    )
}

export default EMGChart;