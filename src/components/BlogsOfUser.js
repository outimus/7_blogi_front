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
  if(user.blogs.length === 0){
    return (
      <div>
        <h4>added blogs</h4>
        <p></p>
        <h5>...</h5>
        <h5>no added blogs</h5>
      </div>
    )
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <h4>added blogs</h4>
      <p></p>
      {user.blogs.map(b =>
        <li key={b.id}> {b.title} </li>)}
    </div>
  )
}

export default BlogsOfUser