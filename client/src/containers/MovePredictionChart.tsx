import React from 'react';
import { Box, Divider, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { sortByTimeStampOldest } from '../utils';


const selectMoves = (state: any) => { 
    return state.liveStore.moves
}

const selectPositions = (state: any) => { 
    return state.liveStore.positions
}

const MovePredictionChart = () => {
    const moveData = useSelector(selectMoves)
    const positionData = useSelector(selectPositions)
    const combineData = [...moveData, ...positionData].sort(sortByTimeStampOldest)
    
    const latestData = (combineData.length !== 0) ? combineData.slice(-1)[0] : undefined
    const getLabels = (obj : any) => {
        if (obj === undefined) {
            return ["-", "-"]    
        }
        else if ("move" in obj) {
            return [latestData.move.toUpperCase(), latestData.accuracy + "%"]  
        } else if ("position" in obj) {
            return [latestData.position.toUpperCase(), "-"] 
        }
        return ["-", "-"]    
    }
    const nameLabel = getLabels(latestData)[0]
    const accLabel = getLabels(latestData)[1]
    
    return (
        <>  
            <Box m={4}>
                <Text fontSize="5xl" letterSpacing={2}>
                    {nameLabel}
                </Text>
            </Box>
            <Divider/>
            <Box m={4}>
                <Text fontSize="5xl" letterSpacing={2}>
                    {accLabel}
                </Text>
            </Box>
            <Divider/>
            <Box m={4}>
                <Text fontSize="5xl" fontWeight="bold" letterSpacing={2} textColor={"green.400"}>
                    {"SUCCESS"}
                </Text>
            </Box>
        </>
    )
}

export default MovePredictionChart