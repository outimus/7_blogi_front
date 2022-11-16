import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { setCurrentBlog } from '../reducers/blogsReducer'

//Renderöi yhden blogin tiedot
const BlogInfo = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const allBlogs = useSelector(state => state.blogs.allBlogs)
  const blog = allBlogs.find(x => x.id === id)
  dispatch(setCurrentBlog(blog))

  const [comment, setNewComment] = useState('')
  console.log(comment)

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <p>{blog.url}</p>
      <p>likes {blog.likes} <button> like </button></p>
      <p>added by {blog.user.name}</p>
      <h3>comments</h3>
      <form type='onSubmit'>
        <input size='40' onChange={(e) => setNewComment(e.target.value)}/><button /*onSubmit={handleSubmit}*/> add comment </button>
      </form>
      <p></p>
      <li>kommentit tähän</li>
    </div>
  )
}

//MITEN TALLENTAN INPUTIN ARVON? TÄHÄNKIN TARVITSEE TIEDOT CURRENTBLOGISTA.
/*const handleSubmit = () => {
  console.log('kissa')
}*/

export default BlogInfo