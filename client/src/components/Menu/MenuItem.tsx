import { Text, Button } from '@chakra-ui/react';
import React, { ReactNode } from 'react'

interface Props {
    children: ReactNode
    to: string
    isOnline?: boolean
}

const MenuItem: React.FC<Props> = ({children, to, isOnline = false, ...rest}) => {
    return (
        
        (!isOnline ? 
            <Button variant="solid" colorScheme="purple" as="a" href={to}>
                <Text display="block" {...rest}>
                    {children}
                </Text>
            </Button> :
            <Button isDisabled={true} variant="solid" colorScheme="purple">
                <Text display="block" {...rest}>
                    {children}
                </Text>
            </Button>
        )
    )
}

export default MenuItem;