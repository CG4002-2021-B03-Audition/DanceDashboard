import { Badge, Box, Stack } from '@chakra-ui/react';
import React from 'react'
import MenuItem from './MenuItem';

interface Props {
    isOpen: boolean
    isOnline: boolean
}

const MenuLinks = ({isOpen, isOnline, ...props}: Props & $ElementProps<typeof Box>) => {
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