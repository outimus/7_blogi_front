import { useState } from 'react'
import Notification from './Notification'
import { useDispatch } from 'react-redux'
import { addNotification } from '../reducers/notificationReducer'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const dispatch = useDispatch()

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const loggedIn = localStorage.getItem('loggedAppUser')

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      userId: loggedIn
    })
    dispatch(addNotification(`A new blog by author ${newAuthor} was added`, 5))
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <>
      <><form className='grid-container' onSubmit={addBlog}>
        <div>
          <div className='grid-container-item grid-item 1'>title: <input
            type='text'
            value={newTitle}
            onChange={handleTitleChange}
            placeholder='...'
            id="title" />
          </div>
        </div>
        <div>
          <div className='grid-container-item grid-item 2'>author: <input
            type='text'
            value={newAuthor}
            onChange={handleAuthorChange}
            id="author" />
          </div>
        </div>
        <div>
          <div className='grid-container-item grid-item 3'>url: <input
            type='text'
            value={newUrl}
            onChange={handleUrlChange}
            id="url" />
          </div>
        </div>
        <p></p>
        <Notification />
        <div className='grid-container-item grid-item 4'>
          <button className='button' id='create-button' type='submit'>C r e a t e</button>
          <p></p>
        </div>
      </form></>
    </>
  )
}

export default BlogForm