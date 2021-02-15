import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface Props {
    children: ReactNode
}

const Button: React.FC<Props> = ({children}) => {
    console.log(children)
    return (
        <Box 
          boxShadow="base"
          textAlign='center' 
        >
          {children}
        </Box>
    )
}

export default Button