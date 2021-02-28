import React from 'react'

import {
  Text,
  Flex,
  Link
} from '@chakra-ui/react'

const Footer = () => {
  return (
    <>
      <Flex bottom='1%' bg='gray.800' w='100%' justifyContent='center'>
        <Text fontSize={20} mb='1%' textAlign='center' mt='5%' color='white'>
          &copy; 2021{" "}
          <Link color="cyan" href="https://eliaswambugu.com">
            Elias Wambugu
        </Link>

        </Text>
      </Flex>
    </>
  )
}

export default Footer