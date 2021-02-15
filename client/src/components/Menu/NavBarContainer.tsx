import { Flex } from '@chakra-ui/react'
import React from 'react'

const NavBarContainer = ({...props}) => {
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            w="100%"
            mb={8}
            p={2}
            bg="white"
            boxShadow="base"
        >
            {props.children}
        </Flex>
    )
}

export default NavBarContainer