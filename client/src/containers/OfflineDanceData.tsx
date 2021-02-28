import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Container, Divider, Stack, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';
import BasicTable from '../components/Tables/BasicTable';
import { sortByTimeStampOldest } from '../utils';

interface Props {
    danceData: never[]
}
const OfflineDanceData: React.FC<Props> = ({ danceData }) => {

    const formatData = danceData.sort(sortByTimeStampOldest).map((obj : any) => {
        let formatObj = {
            name: obj.name, 
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