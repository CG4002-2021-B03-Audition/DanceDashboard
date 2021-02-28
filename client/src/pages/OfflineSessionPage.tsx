import { Grid, GridItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import OfflineDanceData from '../containers/OfflineDanceData';
import OfflineMoveBreakdown from '../containers/OfflineMoveBreakdown';
import SessionsTable from '../containers/SessionsTable';
import { fetchSessions } from '../store/session/actions';

const OfflineSessionPage: React.FC = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchSessions)
    })

    const [session, setSession] = useState()

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
            <GridItem m={2} colSpan={2}>
                <OfflineDanceData session={session}/>
            </GridItem>
            <GridItem colSpan={2}>
                <OfflineMoveBreakdown session={session} />
            </GridItem>
            <GridItem colSpan={4} bg="tomato" />
        </Grid>
    )
}

export default OfflineSessionPage;