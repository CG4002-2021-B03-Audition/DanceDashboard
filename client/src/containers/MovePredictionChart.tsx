import React, { useEffect, useState } from 'react';
import { Box, Divider, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { sortByTimeStampOldest } from '../utils';


const selectMoves = (state: any) => { 
    return state.liveStore.moves
}

const selectPositions = (state: any) => { 
    return state.liveStore.positions
}

const selectActual = (state: any) => { 
    return state.liveStore.actualMoves
}

const MovePredictionChart = () => {
    const moveData = useSelector(selectMoves)
    const positionData = useSelector(selectPositions)
    // const actualData = useSelector(selectActual)
    // const actualMoveIndex = useSelector((state : any) => state.liveStore.actualMoveIndex)
    const combineData = [...moveData, ...positionData].sort(sortByTimeStampOldest)
    
    const latestData = (combineData.length !== 0) ? combineData.slice(-1)[0] : undefined
    const getLabels = (obj : any) => {
        if (obj === undefined) {
            return ["-", "-"]    
        }
        else if ("move" in obj) {
            // return [latestData.move.toUpperCase(), latestData.accuracy + "%", actualData.slice(actualMoveIndex-1)[0].toUpperCase()]  
            return [latestData.move.toUpperCase(), latestData.accuracy + "%"]  
        } else if ("position" in obj) {
            // return [latestData.position.toUpperCase(), "-", actualData.slice(actualMoveIndex-1)[0].toUpperCase()] 
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