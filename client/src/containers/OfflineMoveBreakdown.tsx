import { Container } from '@chakra-ui/react';
import { ChartOptions } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { fetchMoveBreakdown } from '../apiCalls';
import DoughnutChart from '../components/Charts/DoughnutChart';
import { Session } from '../store/session/types';

interface Props {
    session : Session | undefined
}

const options: ChartOptions = {
    layout: {
      padding: {
        
      }
    },
    legend: {
      display: true,
      position: "right"
    },
    elements: {
      arc: {
        borderWidth: 0,
      }
    },
    cutoutPercentage: 60,
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
        <Container
          centerContent
        >
            {/* <PolarChart chartTitle="Move Breakdown" data={data} labels={labels} /> */}
            <DoughnutChart chartTitle="Move Breakdown" values={data} legendLabels={labels} options={options}/>
        </Container>
    )
}

export default OfflineMoveBreakdown;