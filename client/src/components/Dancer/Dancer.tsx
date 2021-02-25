import React from 'react';
import { Text, Image, Stack } from '@chakra-ui/react';

interface Props {
    key: string
    image: string
    label: string
}

const Dancer: React.FC<Props> = ({key, image, label}) => {
    return (
        <Stack m={0}>   
            <Image key={key} src={image}/>    
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