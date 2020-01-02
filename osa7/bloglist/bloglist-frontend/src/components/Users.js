import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const Users = (props) => {
  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th><h4>blogs created</h4></th>
          </tr>
          {props.users.map(user => <tr key={user.username}>
            <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
            <td>{user.blogs.length}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (state) => ({
  users: state.users
})

export default connect(mapStateToProps)(Users)