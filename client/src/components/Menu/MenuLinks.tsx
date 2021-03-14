import { Badge, Box, Button, Stack } from '@chakra-ui/react';
import React from 'react'
import { useDispatch } from 'react-redux';
import { moveSocket } from '../../socket';
import { ws_reset_state } from '../../store/ws/actions';
import MenuItem from './MenuItem';

interface Props {
    isOpen: boolean
    isOnline: boolean
}

const MenuLinks = ({isOpen, isOnline, ...props}: Props & $ElementProps<typeof Box>) => {
    const dispatch = useDispatch()
    const handleConnect = () => {
        // add action here to clean state
        dispatch(ws_reset_state())
        moveSocket.connect()
    }

    const handleDisconnect = () => {
        moveSocket.disconnect()
    }

    return (
        <Box
            display={{ base: isOpen ? "block" : "none", md: "block"}}
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
                    colorScheme={isOnline ? "green" : "pink"}
                    variant="subtle"
                    size="ml"
                >
                    {isOnline ? "Online" : "Offline"}
                </Badge>
                <MenuItem to="/live">Live</MenuItem>
                <MenuItem to="/stats" isOnline={isOnline}>Statistics</MenuItem>
            </Stack>
        </Box>
    )
}

export default MenuLinks;