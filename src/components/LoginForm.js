import PropTypes from 'prop-types'

const LoginForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div className='grid-container2'>
        <div className='grid-container2 item grid-item 1'>username:</div>
        <div className='grid-container2 item grid-item 2'>
          <input
            type="text"
            value={props.username}
            name="Username"
            id="username"
            onChange={props.handleUsernameChange}/>
          <div className='grid-container2 item grid-item 1'>password:</div>
          <div className='grid-container2 item grid-item 2'>
            <input
              type="text"
              value={props.password}
              name="Password"
              id="password"
              onChange={props.handlePasswordChange}
            />
          </div>
        </div>
        <p></p>
      </div>
      <p></p>
      <button className='button' id="login-button" type="submit">L o g i n</button>
      <p></p>
    </form>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm