import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

interface Props {
    headers: string[],
    rowData: string[][],
    shdHighlight?: boolean[], 
}

interface HeaderProps {
    data: string[]
}

interface BodyProps {
    data: string[][],
    shdHighlight?: boolean[],
}

interface RowProps {
    data: string[]
    shdHighlight?: boolean,
}

const TableRows: React.FC<RowProps> = ({data, shdHighlight}) => (
    <Tr>
        {data.map((item, index) => {
            return (
                <Td 
                    key={index}  
                    bgColor={shdHighlight === true ? 'pink.200' : '' }
                >
                    {item}
                </Td>
            )
        })}
    </Tr>
)

const TableHeader: React.FC<HeaderProps> = ({data}) => (
    <Thead>
        <Tr>
            {data.map((item, index) => <Th key={index}>{item}</Th>)}
        </Tr>
    </Thead>
)

const TableBody: React.FC<BodyProps> = ({data, shdHighlight}) => {
    if (data.length === 0) {
        return (
            <Tbody>
                <TableRows key="1" data={["-", "-", "-", "-"]} shdHighlight={false}/>
            </Tbody>
        )
    }
    return (
        <Tbody>
            {data.map((item, index) => <TableRows key={item[1]} data={item} shdHighlight={(shdHighlight !== undefined) ? shdHighlight[index] : false}/>)}
        </Tbody>
    )
}

const BasicTable: React.FC<Props> = (props) => {
    return (
        <>
            <Table size="sm" variant="simple">
                <TableHeader data={props.headers}/>
                <TableBody data={props.rowData} shdHighlight={props.shdHighlight}/>
            </Table>
            
        </>
    )
    
}

export default BasicTable;