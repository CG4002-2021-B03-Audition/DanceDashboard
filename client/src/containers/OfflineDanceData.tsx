import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Container, Divider, Stack, Switch, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BasicTable from '../components/Tables/BasicTable';
import { sortByTimeStampOldest } from '../utils';

interface Props {
    danceData: never[]
}

const selectActual = (state : any) => state.liveStore.actualMoves

const OfflineDanceData: React.FC<Props> = ({ danceData }) => {
    const [ isWrong, setIsWrong ] = useState<boolean[]>()
    const [ showWrongMoves, setShowWrongMoves ] = useState<boolean>(false)
    const [ rows, setRows ] = useState<any>([])
    // To be refactored when actual dance data can be sent
    const actualActions = useSelector(selectActual)

    useEffect(() => {
        let currentScore : boolean[] = []
        danceData.forEach((action : any, index : number) => {
            if(action.name === actualActions[index % actualActions.length]) {
                currentScore.push(false)
            } else {
                currentScore.push(true)
            }
        })

        setIsWrong([...currentScore])
    }, [danceData, actualActions])

    useEffect(() => {
        const formatData = danceData.sort(sortByTimeStampOldest).map((obj : any) => {
            let datetime = new Date(obj.timestamp)
            let formatObj = {
                name: obj.name, 
                timestamp: `${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`, 
                delay: obj.delay,
                accuracy: (obj.accuracy >= 0) ? obj.accuracy * 100 + "%" : "-",
            }
            return formatObj
        })
        const newRows : string[][] = formatData.map((row : any) => Object.values(row))
        setRows([...newRows])
    }, [danceData])
    
    return (
        <Container
            overflowY="auto"
            h="24rem"
        >
            <Stack isInline={true} align="center" justify="center">
              <Text fontSize="2xl" textAlign="center">Session Data</Text>
              <Tooltip label="Displays the statistics of all moves and position changes during the session!">
                <QuestionOutlineIcon/>
              </Tooltip>
              <Switch 
                size="md" 
                colorScheme="purple" 
                onChange={() => {setShowWrongMoves(!showWrongMoves)}}
              />
            </Stack>
            <Divider orientation="horizontal" m={2}/>
            {showWrongMoves ? 
                <BasicTable 
                    headers={["move / position", "timestamp", "delay (ms)", "accuracy"]} 
                    rowData={rows}
                    shdHighlight={isWrong}
                /> :
                <BasicTable 
                    headers={["move / position", "timestamp", "delay (ms)", "accuracy"]} 
                    rowData={rows}
                />
            }
            
        </Container>
    )
}

export default OfflineDanceData;