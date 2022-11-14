import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
/*import { setUser } from './reducers/userReducer'*/
import { setNotification } from './reducers/notificationReducer'
import { createBlog, setBlogs } from './reducers/blogsReducer'
import { useDispatch, useSelector } from 'react-redux'

/*const url = 'http://localhost:3003/api/blogs/'*/

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

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
      dispatch(setUser(user))
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
      const filtered = blogs.filter(blog => blog.id !== blogObject.blog.id)
      dispatch(setBlogs(filtered))
      setUser('')
      dispatch(setNotification(`A blog ${blogObject.blog.title} by author ${blogObject.blog.author} was removed`, 5))}
  }

  const RemoveButton = (blogObject) => {
    const loggedIn = localStorage.getItem('loggedAppUser')
    if (loggedIn === blogObject.blog.userId) {
      return (
        <button id="remove-button" onClick={() => handleRemove(blogObject)}> remove </button>
      )
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
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
      <h1>blogs</h1>
      <p>{user.name} logged in  <button onClick={handleLogout}>logout</button></p>
      <h2>create new</h2>
      <Notification />
      <p></p>
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
