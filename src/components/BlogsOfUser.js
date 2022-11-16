import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

//renderöi yhden käyttäjän lisäämät blogit
const BlogsOfUser = () => {
  const id = useParams().id
  const allUsers = useSelector(state => state.user.allUsers)
  const user = allUsers.find(x => x.id === id)

  if (!user) {
    return null
  }
  return (
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      {user.blogs.map(b =>
        <li key={b.id}> {b.title} </li>)}
    </div>
  )
}

export default BlogsOfUser