import { Grid, GridItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDataInSession } from '../apiCalls';
import OfflineDanceData from '../containers/OfflineDanceData';
import OfflineMoveBreakdown from '../containers/OfflineMoveBreakdown';
import SessionScoreChart from '../containers/SessionScoreChart';
import SessionsTable from '../containers/SessionsTable';
import { fetchSessions } from '../store/session/actions';
import { Session } from '../store/session/types';

const OfflineSessionPage: React.FC = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchSessions)
    })

    const [session, setSession] = useState<Session | undefined>()
    const [danceData, setDanceData] = useState([])

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
    }, [session])

    const handleSessionSelect = (session : any) => {
        console.log("Set session to: ", session)
        setSession(session)
    }
    return (
        <Grid
            h="200px"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(5, 1fr)"
            gap={1}
        >
            <GridItem m={2} rowSpan={2} colSpan={1}>
                <SessionsTable onClick={handleSessionSelect}/>
            </GridItem>
            <GridItem colSpan={2}>
                <SessionScoreChart danceData={danceData}/>
            </GridItem>
            <GridItem colSpan={2}>
                <OfflineMoveBreakdown session={session} />
            </GridItem>
            <GridItem colSpan={4}>
                <OfflineDanceData danceData={danceData}/>
            </GridItem>
        </Grid>
    )
}

export default OfflineSessionPage;