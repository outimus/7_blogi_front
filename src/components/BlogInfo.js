import {  useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { setAllBlogs } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useState } from 'react'
import blogService from '../services/blogs'

const CommentForm = () => {
  const [ input, setInput ] = useState('')
  const id = useParams().id
  const dispatch = useDispatch()
  const allBlogs = useSelector(state => state.blogs.allBlogs)
  const blog = allBlogs.find(x => x.id === id)

  const getInput = (event) => {
    event.preventDefault()
    setInput(event.target.value)
  }

  const handleSubmit = () => {
    if (!blog.comments) {
      const updatedBlog = { ...blog, comments: [ input ] }
      dispatch(setAllBlogs(allBlogs.map(blog => blog.id !== id ? blog : updatedBlog)))
      blogService.update(id, updatedBlog)
    } else {
      const updatedBlog = { ...blog, comments: blog.comments.concat([input]) }
      dispatch(setAllBlogs(allBlogs.map(blog => blog.id !== id ? blog : updatedBlog)))
      blogService.update(id, updatedBlog)
    }
    dispatch(setNotification(`You added a comment to a blog by author ${blog.author}`, 5))
    setInput('')
  }
  if (!blog.comments.lenght === 0) {
    return (
      <>
        <div>
          <h3>Comments</h3>
          <form>
            <div className='flex-gap-container2'>
              <div className='flex-gap-container2 flex-gap-item 1'><input type='text' onChange={getInput}/></div>
              <p></p>
              <div className='flex-gap-container2 flex-gap-item 2'><button className='button' onClick={handleSubmit}>Add a comment </button></div>
              <p></p>
            </div>
            <p></p>
          </form>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div>
          <h3>Comments</h3>
          <form>
            <div className='flex-gap-container2'>
              <div className='flex-gap-container2 flex-gap-item 1'><input type='text' onChange={getInput}/></div>
              <p></p>
              <div className='flex-gap-container2 flex-gap-item 2'><button className='button' onClick={handleSubmit}>Add a comment </button></div>
              <p></p>
            </div>
            <p></p>
          </form>
          {blog.comments.map(x => <li key={x}>{x}</li>)}
        </div>
      </>
    )
  }
}


//Renderöi yhden blogin tiedot
const BlogInfo = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const allBlogs = useSelector(state => state.blogs.allBlogs)
  const blog = allBlogs.find(x => x.id === id)

  const handleLike = () => {
    const addLikes = blog.likes + 1
    const updatedInfo = { ...blog, likes: addLikes }
    dispatch(setAllBlogs(allBlogs.map(blog => blog.id !== id ? blog : updatedInfo)))
    dispatch(setNotification(`You liked this blog by author ${blog.author}`, 5))
  }

  if (!blog) {
    return null
  } else {
    return (
      <div>
        <p></p>
        <h2>{blog.title} by {blog.author}</h2>
        <p><Link>{blog.url}</Link></p>
        <p>{blog.likes} likes <button className='button' onClick={handleLike}>L i k e</button></p>
        <p></p>
        <p>added by {blog.user.name}</p>
        <p></p>
        <p></p>
        <CommentForm blog={blog} />
      </div>
    )
  }
}

export default BlogInfo