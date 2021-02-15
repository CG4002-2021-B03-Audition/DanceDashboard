import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

interface Props {
    toggle: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void | undefined;
    isOpen: boolean;
}

const MenuToggle: React.FC<Props> = ({toggle, isOpen}) => {
    return (
        <Box display={{ base: "block", md: "none" }} onClick={toggle}>
            {isOpen ? <CloseIcon /> : <HamburgerIcon/>}
        </Box>
    )
}

export default MenuToggle