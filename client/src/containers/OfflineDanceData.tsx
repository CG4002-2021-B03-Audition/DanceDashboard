import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Container, Divider, Stack, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { fetchDataInSession } from '../apiCalls';
import BasicTable from '../components/Tables/BasicTable';
import { Session } from '../store/session/types';
import { sortByTimeStampOldest } from '../utils';

interface Props {
    session : Session | undefined
}
const OfflineDanceData: React.FC<Props> = ({ session }) => {
    const [danceData, setDanceData] = useState([])
    const [move, setMove] = useState()

    useEffect(() => {
        async function getDanceData(sid : number) {
            const resp = await fetchDataInSession(sid)
            if (resp.data.success && resp.data.message !== null) {
                setDanceData(resp.data.message)
            } else if (resp.data.success && resp.data.message === null) {
                setDanceData([])
            } else if (!resp.data.success) {
                console.log("Error fetching dance data!")
            }
        }
        if(session !== undefined) {
            getDanceData(session.sid)
        }
    }, [session, move])
    const formatData = danceData.sort(sortByTimeStampOldest).map((obj : any) => {
        let formatObj = {
            move: obj.name, 
            timestamp: obj.timestamp, 
            delay: obj.delay,
            accuracy: (obj.accuracy >= 0) ? obj.accuracy * 100 + "%" : "-",
        }
        return formatObj
    })
    const rows : string[][] = formatData.map((row : any) => Object.values(row))
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
            </Stack>
            <Divider orientation="horizontal" m={2}/>
            <BasicTable 
                headers={["move / position", "timestamp", "delay (ms)", "accuracy"]} 
                rowData={rows}
            />
        </Container>
    )
}

export default OfflineDanceData;