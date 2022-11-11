import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import axios from 'axios'
import Notification from './components/Notification'
import { setNotification } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'
const url = 'http://localhost:3003/api/blogs/'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        setBlogs( blogs )
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
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
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('wrong credentials', 5))
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedAppUser')
    setUser('')
  }

  const handleRemove = (blogObject) => {
    if (window.confirm(`Are you sure you want to remove ${blogObject.blog.title} by author ${blogObject.blog.author}?`)) {
      axios.delete(url + blogObject.blog.id)
      const filtered = blogs.filter(blog => blog.id !== blogObject.blog.id)
      setBlogs(filtered)
      setUser('')}
  }

  const RemoveButton = (blogObject) => {
    console.log(blogObject)
    const whoAddedTheBlog = blogObject.blog.user.name
    if (whoAddedTheBlog === user.name) {
      return (
        <button id="remove-button" onClick={() => handleRemove(blogObject)}> remove </button>
      )
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
    dispatch(setNotification(`A new blog by author ${blogObject.author} was added`, 5))
  }

  const handleLike = (blogObject) => {
    const id = blogObject.id
    const blog = blogs.find(b => b.id === id)
    const addLikes = blog.likes + 1
    const updatedInfo = { ...blog, likes: addLikes }
    blogService
      .update(id, updatedInfo)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedInfo))
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
      <h1>blogs</h1>
      <p>{user.name} logged in  <button onClick={handleLogout}>logout</button></p>
      <h2>create new</h2>
      <Notification />
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      <p></p>
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={JSON.parse(window.localStorage.getItem('loggedAppUser'))}
          handleLike={handleLike}
          RemoveButton={RemoveButton}/>
      )}
    </div>
  )}

export default App
