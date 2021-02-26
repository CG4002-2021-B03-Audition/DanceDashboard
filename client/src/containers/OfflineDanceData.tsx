import { Container } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { fetchMovesInSession } from '../apiCalls';
import BasicTable from '../components/Tables/BasicTable';
import { Session } from '../store/session/types';
import { WsObj, sortByTimeStampNewest } from '../utils';

interface Props {
    session : Session | undefined
}
const OfflineDanceData: React.FC<Props> = ({session}) => {
    const [danceData, setDanceData] = useState([])
    const [move, setMove] = useState()

    useEffect(() => {
        async function getDanceData(sid : number) {
            const resp = await fetchMovesInSession(sid, move)
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
    const formatData = danceData.sort(sortByTimeStampNewest).map((obj : any) => {
        let formatObj = {
            move: obj.move, 
            timestamp: obj.timestamp, 
            delay: obj.delay,
            accuracy: ("move" in obj) ? obj.accuracy * 100 + "%" : "-",
        }
        return formatObj
    })
    const rows : string[][] = formatData.map((row : any) => Object.values(row))
    return (
        <Container
            overflowY="scroll"
            h="24rem"
        >
            <BasicTable 
                headers={["move / position", "timestamp", "delay (ms)", "accuracy"]} 
                rowData={rows}
            />
        </Container>
    )
}

export default OfflineDanceData;