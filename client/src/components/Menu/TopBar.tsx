import React, { useState } from 'react';
import { Image } from '@chakra-ui/react';
import BrandLogo from '../../images/BrandLogo.png';
import MenuToggle from './MenuToggle';
import MenuLinks from './MenuLinks';
import NavBarContainer from './NavBarContainer';
import { useSelector } from 'react-redux';

interface Props {}

const getConnectionStatus = (state: any) => { 
    return state.moveStore.isConnected
}

const TopBar: React.FC<Props> = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)
    const isOnline = useSelector(getConnectionStatus)
    return (
        <NavBarContainer>
            <Image src={BrandLogo} ml={6}/>
            <MenuToggle toggle={toggle} isOpen={isOpen} />   
            <MenuLinks mr={6} isOpen={isOpen} isOnline={isOnline}/>
        </NavBarContainer>
    )
}

export default TopBar