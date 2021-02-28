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


const Signup = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    repassword: ''
  })

  const history = useHistory()
  const toast = useToast()

  const handleLogin = async (event) => {
    event.preventDefault();
    if (user.password !== user.repassword) {
      toast({
        title: "Uh Oh :(",
        description: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } else if (user.name !== '' && user.email !== '' && user.password !== '') {
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(user.email, user.password)
          .then(async userCredentials => {
            userCredentials.user.updateProfile({
              displayName: user.name
            })
            await app.database().ref(`${userCredentials.user.uid}/user`).set({
              email: user.email
            })
          })
        toast({
          title: "",
          description: "Account Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        history.push('/')
      } catch (err) {
        const error = JSON.stringify(err)
        if (error.includes('The email address is badly formatted.')) {
          toast({
            title: "Uh Oh :(",
            description: "The email address is badly formatted",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        } else if (error.includes("least 6 characters")) {
          toast({
            title: "Uh Oh :(",
            description: "Password must be at least 6 characters",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        } else if (error.includes('The email address is already in use')) {
          toast({
            title: "Uh Oh :(",
            description: "This email address is already in use",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        } else {
          toast({
            title: "Uh Oh :(",
            description: err,
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        }
        // alert(err)
      }
    } else {
      toast({
        title: "Uh Oh :(",
        description: "All fields must be filled in",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
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
      <Box  w="100%" h="100vh" overflow="auto" bg="gray.800">
        <Box align='center' bg='gray.800'  w={['100%', '100%', '100%', '100%']} left={['50%', '50%', '50%', '50%']} top='10%'>
          <Text textAlign='center' color='white' fontSize={[60, 60, 70, 80]} fontWeight='200'>Welcome!</Text>
          <form onSubmit={handleLogin}>
            <Flex align='center' flexDir='column'>
              <Input name='name' onChange={handleChange} value={user.name} color='white' w={['70%', '50%', '40%', '30%']} mt='2%' variant='flushed' placeholder="Name" />
              <Input name='email' onChange={handleChange} value={user.email} color='white' w={['70%', '50%', '40%', '30%']} mt='5%' variant='flushed' placeholder="Email" />
              <Input name='password' type='password' onChange={handleChange} value={user.password} color='white' w={['70%', '50%', '40%', '30%']} mt='5%' variant='flushed' placeholder='Password' />
              <Input name='repassword' type='password' onChange={handleChange} value={user.repassword} color='white' w={['70%', '50%', '40%', '30%']} mt='5%' variant='flushed' placeholder='Re-enter Password' />
            </Flex>
            <Button fontSize={20} justifySelf='center' colorScheme='cyan' w='20%' mt='2%' type='submit' >Signup</Button>
          </form>
          <Text mb='5%' mt='2%' color='white'>
            Already A User?{" "}
            <Link color="cyan" href="/login">
              Login
            </Link>
          </Text>
          
        </Box>
        <Footer />
      </Box>
    </>
  )
}

export default Signup