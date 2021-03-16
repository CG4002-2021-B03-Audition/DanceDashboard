import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Container, Divider, Stack, Switch, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getSessionResult } from '../apiCalls';
import BasicTable from '../components/Tables/BasicTable';
import { Session } from '../store/session/types';
import { sortByTimeStampOldest } from '../utils';

interface Props {
    danceData: never[]
    session: Session | undefined
}

const OfflineDanceData: React.FC<Props> = ({ danceData, session }) => {
    const [ isWrong, setIsWrong ] = useState<boolean[]>()
    const [ showWrongMoves, setShowWrongMoves ] = useState<boolean>(false)
    const [ rows, setRows ] = useState<any>([])

    useEffect(() => {
        async function getSessionData(session : Session) {
            const resp = await getSessionResult(session.sid)
            if (resp.data.success && resp.data.message !== null) {
                const results = resp.data.message.map((result : any) => !result.isCorrect)
                setIsWrong(results)
            } 
        }
        if (session !== undefined) { getSessionData(session) }
    }, [session, danceData])

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