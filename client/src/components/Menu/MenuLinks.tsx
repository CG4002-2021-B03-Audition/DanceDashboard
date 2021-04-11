import { Badge, Box, Button, Stack, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { moveSocket, imuSocket, emgSocket } from '../../socket';
import { ws_reset_state } from '../../store/ws/actions';
import MenuItem from './MenuItem';
import { fetchLastSession } from '../../apiCalls';
import SessionSummaryModal from '../Modal/SessionSummaryModal';

interface Props {
    isOpen: boolean
    isOnline: boolean
}

const MenuLinks = (props: Props & $ElementProps<typeof Box>) => {
    const dispatch = useDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ session, setSession ] = useState()
    const handleConnect = () => {
        // add action here to clean state
        dispatch(ws_reset_state())
        moveSocket.connect()
        imuSocket.connect()
        emgSocket.connect()
    }

    const handleDisconnect = async () => {
        moveSocket.disconnect()
        imuSocket.disconnect()
        emgSocket.disconnect()

        // show summary modal upon session stop!
        onOpen()
        const resp = await fetchLastSession()
        if (resp.data.success) {
            setSession({...resp.data.message})
        }

    }

    return (
        <Box
            display={{ base: props.isOpen ? "block" : "none", md: "block"}}
            {...props}
        >
            <Stack
                spacing={5}
                align="center"
                justify={["center", "space-between", "flex-end", "flex-end"]}
                direction={["column", "row", "row", "row"]}
                pt={[4, 4, 0, 0]}   
            >   
                <Button onClick={handleConnect}>Start dance session!</Button>
                <Button onClick={handleDisconnect}>Stop dance session!</Button>
                <Badge 
                    colorScheme={props.isOnline ? "green" : "pink"}
                    variant="subtle"
                    size="ml"
                >
                    {props.isOnline ? "Online" : "Offline"}
                </Badge>
                <MenuItem to="/live">Live</MenuItem>
                <MenuItem to="/stats" isOnline={props.isOnline}>Statistics</MenuItem>
            </Stack>
            <SessionSummaryModal isOpen={isOpen} onClose={onClose} session={session}/>
        </Box>
    )
}

export default MenuLinks;