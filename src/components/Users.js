import { useSelector } from 'react-redux'
import User from './User'

//Renderöi listauksen kaikista käyttäjistä
const Users = () => {
  const allUsers = useSelector(state => state.user.allUsers)

  return (
    <div>
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

export default Users