import React from 'react';
import { Stack } from '@chakra-ui/react';
import Dancer1 from '../images/dancer1.png';
import Dancer2 from '../images/dancer2.png';
import Dancer3 from '../images/dancer3.png';
import Dancer from '../components/Dancer/Dancer';

interface Positions {
    [key: string]: JSX.Element
    1: JSX.Element 
    2: JSX.Element 
    3: JSX.Element 
}

const DancePositions: React.FC = () => {
    const mappings: Positions = {
        "1": <Dancer key="1" image={Dancer1} label="Dancer 1"/>,
        "2": <Dancer key="2" image={Dancer2} label="Dancer 2"/>,
        "3": <Dancer key="3" image={Dancer3} label="Dancer 3"/>,
    }

    const positionOrder = (positions : string[]) => {
        return positions.map((pos: string) => mappings[pos])
    }

    return (
        <Stack isInline={true}  
            pt={6}
            spacing={24}
        >   
            {positionOrder(["1", "2", "3"])}
        </Stack>
    )
}

export default DancePositions;