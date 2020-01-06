import React from 'react'
import { connect } from 'react-redux'
import { Header, List } from 'semantic-ui-react'

const User = (props) => {
  if(props.user === undefined) {
    return null
  }

  return (
    <div data-cy='userView'>
      <Header as='h2'>{props.user.name}</Header>
      <Header as='h3'>blogs created</Header>
      <List bulleted>
        {props.user.blogs.map(blog =>
          <List.Item key={blog.id}>{blog.title}</List.Item>
        )}
      </List>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  user: state.users.find(u => u.id === ownProps.user)
})

export default connect(mapStateToProps)(User)