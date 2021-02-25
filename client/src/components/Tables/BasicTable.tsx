import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

interface Props {
    headers: string[],
    rowData: string[][],
}

interface HeaderProps {
    data: string[]
}

interface BodyProps {
    data: string[][]
}

interface RowProps {
    data: string[]
}

const TableRows: React.FC<RowProps> = ({data}) => (
    <Tr>
        {data.map(item => <Td>{item}</Td>)}
    </Tr>
)

const TableHeader: React.FC<HeaderProps> = ({data}) => (
    <Thead>
        <Tr>
            {data.map(item => <Th key={item}>{item}</Th>)}
        </Tr>
    </Thead>
)

const TableBody: React.FC<BodyProps> = ({data}) => (
    <Tbody>
        {data.map(item => <TableRows key={item[1]} data={item}/>)}
    </Tbody>
)

const BasicTable: React.FC<Props> = (props) => {
    return (
        <Table size="sm" variant="striped" colorScheme="purple">
            <TableHeader data={props.headers}/>
            <TableBody data={props.rowData}/>
        </Table>    
    )
    
}

export default BasicTable;