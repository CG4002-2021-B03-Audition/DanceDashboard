import React from 'react';
import { Stack } from '@chakra-ui/react';
import Dancer1 from '../images/dancer1.png';
import Dancer2 from '../images/dancer2.png';
import Dancer3 from '../images/dancer3.png';
import Dancer from '../components/Dancer/Dancer';
import { useSelector } from 'react-redux';
import { Position } from '../store/ws/types';

interface Positions {
    [key: string]: JSX.Element
    1: JSX.Element 
    2: JSX.Element 
    3: JSX.Element 
}

const getPositions = (state: any) => {
    return state.liveStore.positions.slice(-1)
}

const DancePositions: React.FC = () => {
    const currentPositionsObj = useSelector(getPositions)[0]

    const mappings: Positions = {
        "1": <Dancer key="1" image={Dancer1} label="Dancer 1"/>,
        "2": <Dancer key="2" image={Dancer2} label="Dancer 2"/>,
        "3": <Dancer key="3" image={Dancer3} label="Dancer 3"/>,
    }

    const positionOrder = (obj : Position) => {
        if (!obj) {
            let positionsList = ["1", "2", "3"]
            return positionsList.map((pos: string) => mappings[pos])
        }
        let positionsList = obj.position.split(" ")
        return positionsList.map((pos: string) => mappings[pos])
    }

    return (
        <Stack isInline={true}  
            pt={6}
            spacing={24}
        >   
            {positionOrder(currentPositionsObj)}
        </Stack>
    )
}

export default DancePositions;