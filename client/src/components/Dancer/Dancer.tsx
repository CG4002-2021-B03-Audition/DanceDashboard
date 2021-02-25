import React from 'react';
import { Text, Image, Stack } from '@chakra-ui/react';

interface Props {
    image: string
    label: string
}

const Dancer: React.FC<Props> = ({image, label}) => {
    return (
        <Stack m={0}>   
            <Image src={image}/>    
            <Text 
                align="center" 
                fontSize="sm" 
                fontWeight="bold"
                letterSpacing={2}
            >
                {label}
            </Text>
        </Stack>
        
        
    )
}

export default Dancer;