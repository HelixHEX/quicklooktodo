import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Text,
  Box,
  Flex,
  Link,
  Input,
  Button,
  useToast
} from '@chakra-ui/react'

import app from '../firebase'

import { AuthContext } from "../Auth";
import Footer from './Footer';

const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  
  const history = useHistory()
  const toast = useToast()
  
  const handleLogin = async (event) => {
    event.preventDefault();
    try { 
      await app.auth().signInWithEmailAndPassword(user.email, user.password)
      toast({
        title: "",
        description: "Logged in!",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      history.push('/')
    } catch (err) {
      const error = JSON.stringify(err)
      if (error.includes('There is no user record')) {
        toast({
          title: "Uh Oh :(",
          description: "Incorrect email/password",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      } else if (error.includes('The password is invalid')) {
        toast({
          title: "Uh Oh :(",
          description: "Incorrect email/password",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Uh Oh :(",
          description: "An error has occurred please try again",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  const handleChange = (event) => {
    const value = event.target.value
    setUser({
      ...user,
      [event.target.name]: value
    })
  }

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    history.push('/')
  }
  return (
    <>
      <Box w="100%" h="100vh" overflow="auto" bg="gray.800">
        <Box align='center' bg='gray.800'  w={['100%', '100%', '100%', '100%']} left={['50%', '50%', '50%', '50%']} top='20%'>
          <Text color='white' fontSize={[60, 60, 70, 80]} fontWeight='200'>Welcome!</Text>
          <form onSubmit={handleLogin}>
            <Flex align='center' flexDir='column'>
              <Input name='email' onChange={handleChange} value={user.email} color='white' w={['70%', '50%', '40%', '30%']} mt='2%' variant='flushed' placeholder="Email" />
              <Input name='password' type='password' onChange={handleChange} value={user.password} color='white'  w={['70%', '50%', '40%', '30%']} mt='5%' variant='flushed' placeholder='Password' />
            </Flex>
            <Button fontSize={20} colorScheme='cyan' w='20%' mt='2%' type='submit' >Login</Button>
          </form>
          <Text mt='2%' color='white'>
            New User?{" "}
            <Link color="cyan" href="/signup">
              Signup
            </Link>
          </Text>
        </Box>
        <Footer />
      </Box>
    </>
  )
}

export default Login