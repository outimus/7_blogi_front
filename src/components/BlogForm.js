import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

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
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>title:  <input
        value={newTitle}
        onChange={handleTitleChange}
        placeholder='write here some content'
        id="title"
      />
      </div>
      <div>author:  <input
        value={newAuthor}
        onChange={handleAuthorChange}
        id="author"
      />
      </div>
      <div>url:  <input
        value={newUrl}
        onChange={handleUrlChange}
        id="url"
      />
      </div>
      <p></p>
      <button id="create-button" type="submit">create</button>
    </form>
  )
}

export default BlogForm