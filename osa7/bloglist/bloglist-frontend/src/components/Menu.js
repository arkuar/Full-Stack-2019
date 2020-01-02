import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import blogService from '../services/blogs'
import { clearUser } from '../reducers/loginReducer'

const Menu = (props) => {
  const padding = {
    paddingRight: 5
  }
  const handleLogout = () => {
    props.clearUser()
    blogService.destroyToken()
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  return (
    <div style={{ backgroundColor: '#c7c1c1' }}>
      <Link to='/' style={padding}>blogs</Link>
      <Link to='/users'style={padding}>users</Link>
      <span>{props.user.name} logged in <button onClick={handleLogout}>logout</button></span>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, { clearUser })(Menu)