import { Container, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { fetchMoveBreakdown } from '../apiCalls';
import PolarChart from '../components/Charts/PolarChart';
import { Session } from '../store/session/types';

interface Props {
    session : Session | undefined
}

const OfflineMoveBreakdown: React.FC<Props> = ({ session }) => {
    const [ data, setData ] = useState<number[]>([])
    const [ labels, setLabels ] = useState<string[]>([])
    useEffect(() => {
        async function getMoveBreakdown(sid : number) {
            const resp = await fetchMoveBreakdown(sid)
            if (resp.data.success) {
                let moves = resp.data.message.map((el : string[]) => el[0])
                let counts = resp.data.message.map((el : string[]) => parseInt(el[1]))
                setLabels(moves)
                setData(counts)
            }
        }
        if (session !== undefined) { getMoveBreakdown(session.sid) }
    }, [session])
    return (
        <Container>
            <Text fontSize="lg" textAlign="center">Move Breakdown</Text>
            <PolarChart data={data} labels={labels} />
        </Container>
    )
}

export default OfflineMoveBreakdown;