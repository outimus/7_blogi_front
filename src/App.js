import { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import Blog from './components/Blog'
import Users from './components/Users'
import BlogsOfUser from './components/BlogsOfUser'
import BlogInfo from './components/BlogInfo'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

import { setUser, setAllUsers } from './reducers/userReducer'
import { setNotification } from './reducers/notificationReducer'
import { createBlog, setAllBlogs } from './reducers/blogsReducer'

import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
} from 'react-router-dom'


const Menu = (props) => {
  const loggedIn = useSelector(state => state.user.loggedIn.name)
  return (
    <Router>
      <div className='flex-gap-container'>
        <div className='flex-gap-container flex-gap-item 1'><Link to='/'>blogs</Link></div>
        <div className='flex-gap-container flex-gap-item 2'><Link to='/users'>users</Link></div>
        <div className='flex-gap-container flex-gap-item 3'>{loggedIn} is logged in</div>
        <div className='flex-gap-container flex-gap-item 4'><button className='logout-button' onClick={props.handleLogout}> L o g o u t </button></div>
      </div>
      <p></p>
      <h1>Blogs</h1>
      <p></p>
      <Routes>
        <Route path='/' element={<Home
          blogFormRef={props.blogFormRef}
          addBlog={props.addBlog}
          sortedBlogs={props.sortedBlogs}/>} />
        <Route path='/users' element={<Users sortedBlogs={props.sortedBlogs}/>} />
        <Route path='/users/:id' element={<BlogsOfUser id={props.id} />} />
        <Route path='/blogs/:id' element={<BlogInfo />} />
      </Routes>
    </Router>
  )
}

const Home = (props) => {
  return (
    <div>
      <p></p>
      <h2>Create a new blog</h2>
      <p></p>
      <Togglable buttonLabel='New blog' ref={props.blogFormRef}>
        <div>
          <BlogForm createBlog={props.addBlog}/>
        </div>
      </Togglable>
      <p></p>
      <Notification />
      <p></p>
      {props.sortedBlogs.map(blog =>
        <Link key={blog.id} to={`/blogs/${blog.id}`}>
          <Blog blog={blog}/>
        </Link>
      )}
    </div>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs.allBlogs)
  const user = useSelector(state => state.user)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        dispatch(setAllBlogs(blogs))
      })
  }, [])

  useEffect(() => {
    userService
      .getAll()
      .then(users => {
        console.log(users)
        dispatch(setAllUsers(users))
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(setNotification(`${user.name} is successfully logged in!`, 5))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('wrong credentials', 5))
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedAppUser')
    dispatch(setUser(null))
    setUser('')
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject)
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`A new blog by author ${blogObject.author} was added`, 5))
  }

  const blogFormRef = useRef()

  if (user.loggedIn === null) {
    return (
      <div>
        <h2>Login to application</h2>
        <Notification />
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    )
  }

  const sortedBlogs = [...blogs ].sort((a,b) => {
    return b.likes - a.likes
  })

  return (
    <div className='container'>
      <Menu
        sortedBlogs={sortedBlogs}
        blogFormRef={blogFormRef}
        addBlog={addBlog}
        handleLogout={handleLogout}/>
    </div>
  )}

export default App