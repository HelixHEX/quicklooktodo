import React from 'react'

import {
  Text,
  Box
} from '@chakra-ui/react'

const PageNotFound = () => {
  return (
    <>
      <Box w='100%' h='100vh' bg="gray.800">
        <Text textAlign='center' align='center' color='white' fontWeight='200' fontSize={100} >404 :(</Text>
     </Box>
    </>
  )
}

export default PageNotFound