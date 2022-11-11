import Togglable from './Togglable'

const Blog = ({ blog, handleLike, RemoveButton }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <Togglable id='view-button' buttonLabel='view' className='view'>
        <p>{blog.url}</p>
        <>likes   {blog.likes} <button className='likes' id='likes-button' onClick={() => handleLike(blog)}> like </button></>
        <p></p>
        <RemoveButton blog={blog}/>
      </Togglable>
    </div>
  )}


export default Blog