import React, { useState, useEffect } from 'react'

import {
  Text,
  Flex,
  Button,
  Box,
  Input,
  SimpleGrid,
  Select,
  CircularProgress,
  CircularProgressLabel,
  List,
  ListItem,
  Checkbox,
  IconButton,
  useToast,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react'

import app from '../firebase'
import firebase from 'firebase/app'
import {
  DeleteIcon,
} from '@chakra-ui/icons'

import Footer from './Footer'

const database = app.database()

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      currentUser: ''
    }
  }
  componentDidMount() {
    const user = firebase.auth().currentUser
    if (user !== null) {
      const main = async () => {
        this.setState({
          currentUser: await firebase.auth().currentUser.uid
        })
        await database.ref(`${this.state.currentUser}/categories`).orderByKey().on('child_added', async (snapshot) => {
          let percent = 0;
          let todos = [];
          let completed = 0;
          let todo = 0;
          if (snapshot.val().todos) {
            await database.ref(`${this.state.currentUser}/categories/${snapshot.key}/todos/`).orderByChild('completed').on('child_added', (todoSnap) => {
              if (todoSnap.val().completed) {
                completed = completed + 1

              } else {
                todo += 1
              }
              todos.push({
                todo: todoSnap.val(),
                key: todoSnap.key
              })
              percent = Math.round((completed / todos.length) * 100)
            })
          } else {
            completed = 0
            percent = 0
          }

          this.setState(prevState => ({
            categories: [
              ...prevState.categories,
              {
                name: snapshot.val().name,
                todos: todos,
                percent: percent,
                todo,
                completed: 0,
                key: snapshot.key
              }
            ]
          }))
        })

        await database.ref(`${this.state.currentUser}/categories/`).on('child_changed', async snapshot => {
          let categoriesCopy = JSON.parse(JSON.stringify(this.state.categories))
          for (var i = 0; i < categoriesCopy.length; i++) {
            if (categoriesCopy[i].name === snapshot.val().name) {
              let percent;
              let todos = [];
              let todo = 0;
              let completed = 0;
              if (snapshot.val().todos) {
                await database.ref(`${this.state.currentUser}/categories/${snapshot.key}/todos/`).on('child_added', (todoSnap) => {
                  if (todoSnap.val().completed) {
                    completed += 1
                  } else {
                    todo += 1
                  }
                  todos.push({
                    todo: todoSnap.val(),
                    key: todoSnap.key
                  })

                  percent = Math.round((completed / todos.length) * 100)
                })
              } else {
                percent = 0
                completed = 0
              }

              // if (snapshot.val().completed) {
              //   await database.ref('/categories/' + snapshot.key + '/completed/').on('child_added', (completedSnap) => {
              //     completed.push({
              //       todo: completedSnap.val(),
              //       key: completedSnap.key
              //     })
              //   })

              //   percent = Math.round((completed.length / (completed.length + todos.length)) * 100);
              // } else {
              //   percent = 0
              // }

              categoriesCopy[i] = {
                name: snapshot.val().name,
                todos: todos,
                percent,
                completed,
                todo,
                key: snapshot.key
              }
              this.setState({
                categories: categoriesCopy
              })
            }
          }
        })
      }

      main()


      // categories: [
      //   ...prevState.categories,
      //   {
      //     name: snapshot.val().name,
      //     completed: snapshot.val().completed,
      //     todo: snapshot.val().todo,
      //     todos: snapshot.val().todos
      //   }
      // ]
    }
  }

  componentWillUnmount() {
    database.ref(`${this.state.currentUser}/categories/`).off()
  }

  render() {
    return (
      <>
        <Display currentUser={this.state.currentUser} categories={this.state.categories} />
        {/* {this.state.categories.map((data, index) => (
          <>
            {data.todos.map((todo, tIndex) => (
              <Text>{todo.name}</Text>
            ))}
          </>
        ))} */}
      </>
    )
  }
}
const Display = (props) => {
  const toast = useToast()
  const [currentUser, setCurrentUser] = useState('')
  const [category, setCategory] = useState('');
  const [todo, setTodo] = useState({
    name: '',
    category: null,
    key: ''
  })

  // eslint-disable-next-line
  const [colors, setColors] = useState([
    'orange.400',
    'blue.400',
    'red.400',
    'purple.400'
  ])

  useEffect(() => {
    setCurrentUser(props.currentUser)
  }, [setCurrentUser, props.currentUser])

  const handleCatChange = (event) => {
    const value = event.target.value
    setCategory(value)
  }

  const handleCatSubmit = async (event) => {
    event.preventDefault()
    var duplicate = false
    for (var i = 0; i < props.categories.length; i++) {
      if (props.categories[i].name === category) {
        duplicate = true
      }
    }
    if (!duplicate) {
      if (props.categories.length >= 4) {
        toast({
          title: "Uh Oh :(",
          description: "The max number of categories is 4",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      } else {
        await database.ref(`${currentUser}/categories/`).push({
          name: category,
        })
        setCategory('')
      }
    } else {
      toast({
        title: "Uh Oh :(",
        description: "Duplicate category",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleTodoChange = (event) => {
    const value = event.target.value
    setTodo({
      ...todo,
      [event.target.name]: value
    })
  }


  const handleTodoSubmit = async (event, key) => {
    event.preventDefault()
    // const newArr = categories.map((data, index) => {
    //   if (index === todoCat) {
    //     return {
    //       ...data,
    //       [todo]: [...todo, {
    //         name: todo,
    //         category: data.name
    //       }]
    //     }
    //   }
    // })
    // // setCategories(newArr)
    // await database.ref('categories/').push({
    //   name: 
    // })
    if (todo.name === "" || todo.category === null) {
      toast({
        title: "Uh Oh :(",
        description: "Please make sure to fill all fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } else {
      await database.ref(`${currentUser}/categories/${todo.category}/todos/`).push({
        name: todo.name,
        completed: false
      })
      setTodo({
        ...todo,
        name: ''
      })
    }
  }


  const handleCheck = async (e, data, item) => {
    await database.ref(`${currentUser}/categories/${data.key}/todos/${item.key}`).update({
      completed: !item.todo.completed
    })

  }

  const handleTodoDelete = async (e, data, todo) => {
    await database.ref(`${currentUser}/categories/${data.key}/todos/${todo.key}`).remove()
  }

  const handleCatNChange = async (e, data) => {
    if (e !== data.name) {
      await database.ref(`${currentUser}/categories/${data.key}`).update({
        name: e
      })
      window.location.reload(true);
    }
  }

  const handleTodoNChange = async (e, data, item) => {
    if (e !== item.todo.name) {
      await database.ref(`${currentUser}/categories/${data.key}/todos/${item.key}`).update({
        name: e
      })
    }
  }

  const signOutUser = () => {
    app.auth().signOut();
  }

  return (
    <>
      <Box w="100%" h="100vh" overflow="auto" bg="gray.800">
      <Button left={['78%','80%' ,'88%' ,'90%']} w={['20%', '15%', '10%', '8%']} mt='2%' flexDir='end'  onClick={signOutUser} colorScheme="red">Logout</Button>
        <Box ml="5%" mt="1%" mr="5%">
          <form onSubmit={handleCatSubmit}>
            <Flex w="100%" flexDir={['column', 'column', "row", 'row']}>
              <Text fontWeight="200" color="white" textTransform="uppercase" fontSize={30}>categories</Text>
              <Flex ml="2%" w="100%">
                <Input value={category} onChange={handleCatChange} color="white" ml="4%" variant="flushed" w={["60%", '40%', '40%', "30%"]} placeholder="Create Category (max 4)" />
                <Button type="submit" colorScheme="cyan" ml="5%">
                  Create
              </Button>
                {props.categories.length}
              </Flex>
              
            </Flex>
          </form>

          <SimpleGrid justifyContent="center" mt="2%" h="50%" spacing={5} columns={[props.categories.length / 4, props.categories.length / 4, props.categories.length / 2, props.categories.length]}>
            {props.categories
              ? <>
                {props.categories.map((data, index) => (
                  <Flex flexDir="column">
                    <Box p={5} rounded={25} bg={colors[index]} w={300} h={200} overflow="auto">
                      <CircularProgress value={data.percent} color='blue.900'>
                        <CircularProgressLabel>{data.percent}%</CircularProgressLabel>
                      </CircularProgress>
                      <Editable
                        mt="15%"
                        fontSize={25}
                        fontWeight="700"
                        onSubmit={(e) => handleCatNChange(e, data)}
                        defaultValue={data.name}>
                        <EditablePreview />
                        <EditableInput />
                      </Editable>
                      <Text fontWeight="200" ml="1%" bottom={5}>{data.todos.length} Items</Text>
                    </Box>
                  </Flex>
                ))}
              </>
              : null}
          </SimpleGrid>
          {props.categories
            ? <>
              <form onSubmit={handleTodoSubmit}>
                <Flex w="100%" mt="5%" flexDir="row" justifyContent="center">
                  <Input name="name" value={todo.name} onChange={handleTodoChange} color="white" placeholder="Add Item" variant="flushed" w="30%" />
                  <Select name="category" value={todo.category} onChange={handleTodoChange} color="white" ml="5%" w="30%" variant="flushed" placeholder="Select category">
                    {props.categories.map((data, index) => (
                      <option key={index} value={data.key}>{data.name}</option>
                    ))}
                  </Select>
                  <Button type="submit" colorScheme="cyan" ml="5%">
                    Add Item
                  </Button>
                </Flex>
              </form>
            </>
            : null
          }

          <SimpleGrid justifyContent="center" mb="5%" mt="5%" h="50%" spacing={5} columns={[props.categories.length / 4, props.categories.length / 4, props.categories.length / 4, props.categories.length]}>
            {props.categories.map((data, index) => (
              <>
                <>
                  <Flex>
                    <Box color='white' rounded={25} bg="blue.900" w={300} minH={400} h='auto' overflow="auto">
                      <Box bg={colors[index]} w="100%" h={10}>
                        <Text color="gray.900" textAlign="center" fontWeight="200" fontSize={25}>{data.name}</Text>
                      </Box>
                      <Flex mt={"2%"} flexDir="column" justifyContent="center">
                        <Text fontSize={20} ml="2%" fontWeight="700" textAlign="center">
                          Completed: {data.completed}
                        </Text>
                      </Flex>
                      <List mt="5%" ml="5%" mr="5%" mb="10%">
                        <Flex mt={"2%"} flexDir="column" justifyContent="center">
                          <Text fontSize={20} fontWeight="700" textAlign="center">
                            Todo: {data.todo}
                          </Text>
                        </Flex>
                        {data.todos
                          ? <>
                            {data.todos.map((item, tIndex) => (
                              <ListItem key={tIndex} mt="4%">
                                <Flex flexDir="row">
                                  <Checkbox isChecked={item.todo.completed} onChange={(e) => handleCheck(e, data, item)} colorScheme="green"></Checkbox>
                                  <Editable
                                    ml="5%"
                                    onSubmit={(e) => handleTodoNChange(e, data, item)}
                                    defaultValue={item.todo.name}>
                                    <EditablePreview />
                                    <EditableInput />
                                  </Editable>
                                  <IconButton onClick={(e) => handleTodoDelete(e, data, item)} ml="5%" size="sm" colorScheme="red" aria-label='delete item' icon={<DeleteIcon />} />
                                </Flex>
                              </ListItem>
                            ))}
                          </>
                          : null}
                        { }
                      </List>
                    </Box>
                  </Flex>
                </>
              </>
            ))}
          </SimpleGrid>
        </Box>
        <Footer />
      </Box>
    </>
  )
}



export default Home