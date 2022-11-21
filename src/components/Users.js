import { useSelector } from 'react-redux'
import User from './User'

//Renderöi listauksen kaikista käyttäjistä
const Users = () => {
  const allUsers = useSelector(state => state.user.allUsers)

  return (
    <div>
      <div className='flex-gap-container4'>
        <h2>Users</h2>
        <div className='flex-gap-container4 flex-gap-item 2'></div>
        <div className='flex-gap-container4 flex-gap-item 1'></div>
        <div className='flex-gap-container4 flex-gap-item 2'><h4>blogs created</h4></div>
      </div>
      <p></p>
      <table>
        <tbody>
          <p></p>
          <tr className='flex-gap-container3'>
            <th></th>
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