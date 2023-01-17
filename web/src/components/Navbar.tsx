import { Box, Flex, Link } from '@chakra-ui/core'
import React from 'react'

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({}) => (
    <Flex bg="teal.500" padding={4} marginLeft={'auto'}>
        <Box ml={'auto'}>
            <Link mr={4} href='/login'>Login</Link>
            <Link href='/register'>Register</Link>
        </Box>
        
    </Flex>
)