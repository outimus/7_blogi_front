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
  const padding = {
    padding: 5,
    color: 'white',
    backgroundColor: 'grey'
  }
  return (
    <Router>
      <div style={padding}>
        <p></p>
        <Link to='/'>blogs  </Link>
        <Link to='/users'>users  </Link>
        <>  {loggedIn}  logged in  </>
        <button onClick={props.handleLogout}> logout </button>
      </div>
      <h1>blogs</h1>
      <Routes>
        <Route path='/' element={<Home
          blogFormRef={props.blogFormRef}
          addBlog={props.addBlog}
          sortedBlogs={props.sortedBlogs}
          /*handleLike={props.handleLike}
          removeButton={props.removeButton}
          handleLogout={props.handlelogout}*//>} />
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
      <h2>create new</h2>
      <Notification />
      <p></p>
      <Togglable buttonLabel='new blog' ref={props.blogFormRef}>
        <BlogForm createBlog={props.addBlog}/>
      </Togglable>
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

  const handleRemove = (blogObject) => {
    if (window.confirm(`Are you sure you want to remove ${blogObject.blog.title} by author ${blogObject.blog.author}?`)) {
      const filtered = blogs.filter(blog => blog.id !== blogObject.blog.id)
      blogService.deleteBlog(blogObject.blog.id)
      dispatch(setAllBlogs(filtered))
      setUser('')
      dispatch(setNotification(`A blog ${blogObject.blog.title} by author ${blogObject.blog.author} was removed`, 5))}
  }

  const RemoveButton = (blogObject) => {
    const blogAdder = blogObject.blog.user.username
    const loggedIn = user.loggedIn.username

    if (blogAdder === loggedIn) {
      return (
        <button id="remove-button" onClick={() => handleRemove(blogObject)}> remove </button>
      )}
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject)
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`A new blog by author ${blogObject.author} was added`, 5))
  }

  const handleLike = (blogObject) => {
    const id = blogObject.id
    const blog = blogs.find(b => b.id === id)
    const addLikes = blog.likes + 1
    const updatedInfo = { ...blog, likes: addLikes }
    dispatch(setAllBlogs(blogs.map(blog => blog.id !== id ? blog : updatedInfo)))
    dispatch(setNotification(`You liked a blog by author ${blogObject.author}`, 5))
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
    <div>
      <Menu
        sortedBlogs={sortedBlogs}
        blogFormRef={blogFormRef}
        addBlog={addBlog}
        handleLike={handleLike}
        removeButton={RemoveButton}
        handleLogout={handleLogout}/>
    </div>
  )}

export default App