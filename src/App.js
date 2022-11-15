import { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

import { setUser, setAllUsers } from './reducers/userReducer'
import { setNotification } from './reducers/notificationReducer'
import { createBlog, setBlogs } from './reducers/blogsReducer'

import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams,
} from 'react-router-dom'

const Menu = (props) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <Router>
      <div>
        <p></p>
        <Link style={padding} to='/'>blogs</Link>
        <Link style={padding} to='/users'>users</Link>
      </div>
      <Routes>
        <Route path='/' element={<Home
          blogFormRef={props.blogFormRef}
          addBlog={props.addBlog}
          sortedBlogs={props.sortedBlogs}
          handleLike={props.handleLike}
          removeButton={props.removeButton}
          handleLogout={props.handlelogout}/>} />
        <Route path='/users' element={<Users handleLogout={props.handleLogout} sortedBlogs={props.sortedBlogs}/>} />
        <Route path="/users/:id" element={<BlogsOfUser handleLogout={props.handleLogout} />} />
      </Routes>
    </Router>
  )
}

const Home = (props) => {
  const user = JSON.parse(window.localStorage.getItem('loggedAppUser'))

  return (
    <div>
      <h1>blogs</h1>
      <p>{user.name} logged in</p>
      <button onClick={props.handleLogout}>logout</button>
      <p></p>
      <h2>create new</h2>
      <Notification />
      <p></p>
      <Togglable buttonLabel='new blog' ref={props.blogFormRef}>
        <BlogForm createBlog={props.addBlog}/>
      </Togglable>
      <p></p>
      {props.sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleLike={props.handleLike}
          RemoveButton={props.removeButton}/>
      )}
    </div>
  )
}

const Users = (props) => {
  const allUsers = useSelector(state => state.user.allUsers)
  const user = JSON.parse(window.localStorage.getItem('loggedAppUser'))

  return (
    <div>
      <h1>blogs</h1>
      <p>{user.name} logged in</p>
      <button onClick={props.handleLogout}>logout</button>
      <h2>users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {allUsers.map(user =>
            <User
              key={user.id}
              user={user}/>)}
        </tbody>
      </table>
    </div>
  )
}

const BlogsOfUser = ({ handleLogout }) => {
  const id = useParams().id
  const loggedIn = useSelector(state => state.user.loggedIn)
  const allUsers = useSelector(state => state.user.allUsers)
  const user = allUsers.find(x => x.id === id)

  return (
    <div>
      <h1>blogs</h1>
      <p>{loggedIn.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      {user.blogs.map(b =>
        <li key={b.id}> {b.title} </li>)}
    </div>
  )
}

const User = ({ user }) => {
  return (
    <tr>
      <td><Link to={`/users/${user.id}`}> {user.name} </Link></td>
      <td> {user.blogs.length}</td>
    </tr>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        dispatch(setBlogs(blogs))
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
      dispatch(setBlogs(filtered))
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
    dispatch(setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedInfo)))
    dispatch(setNotification(`You liked a blog by author ${blogObject.author}`, 5))
  }

  const blogFormRef = useRef()

  if (user === null) {
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

  const sortedBlogs = [...blogs].sort((a,b) => {
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
