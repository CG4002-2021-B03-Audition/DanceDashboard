import { Box, Stack } from '@chakra-ui/react';
import React from 'react'
import MenuItem from './MenuItem';

interface Props {
    isOpen: boolean
}

const MenuLinks = ({isOpen, ...props}: Props & $ElementProps<typeof Box>) => {
    return (
        <Box
            display={{ base: isOpen ? "block" : "none", md: "block"}}
            {...props}
        >
            <Stack
                spacing={8}
                align="center"
                justify={["center", "space-between", "flex-end", "flex-end"]}
                direction={["column", "row", "row", "row"]}
                pt={[4, 4, 0, 0]}   
            >
                <MenuItem to="/">Live</MenuItem>
                <MenuItem to="/stats">Statistics</MenuItem>
            </Stack>
        </Box>
    )
}

export default MenuLinks;