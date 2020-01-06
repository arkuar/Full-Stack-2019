import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import blogService from '../services/blogs'
import { clearUser } from '../reducers/loginReducer'
import { Menu, Button } from 'semantic-ui-react'

const Navigation = (props) => {
  const handleLogout = () => {
    props.clearUser()
    blogService.destroyToken()
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  return (
    <Menu inverted data-cy='navigation'>
      <Menu.Item link>
        <Link to='/'>blogs</Link>
      </Menu.Item>
      <Menu.Item link>
        <Link data-cy='usersTabLink' to='/users'>users</Link>
      </Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item>
          <span>{props.user.name} logged in <Button onClick={handleLogout}>logout</Button></span>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, { clearUser })(Navigation)