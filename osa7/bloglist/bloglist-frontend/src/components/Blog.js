import React from 'react'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

const Blog = (props) => {

  if(props.blog === undefined) {
    return null
  }

  const like = async (blog) => {
    props.likeBlog(blog)
    props.setNotification(`blog ${blog.title} by ${blog.author} liked!`, null, 10)
  }

  const remove = async (blog) => {
    const ok = window.confirm(`remove blog ${blog.title} by ${blog.author}`)
    if (ok) {
      props.removeBlog(blog)
      props.setNotification(`blog ${blog.title} by ${blog.author} removed!`, null, 10)
    }
  }

  return (
    <div>
      <h2>{props.blog.title} {props.blog.author}</h2>
      <a href={props.blog.url}>{props.blog.url}</a>
      <div>{props.blog.likes} likes
        <button onClick={() => like(props.blog)}>like</button>
      </div>
      <div>added by {props.blog.user.name}</div>
      {props.user.username === props.blog.user.username ? <button onClick={() => remove(props.blog)}>remove </button> : null}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  blog: state.blogs.find(b => b.id === ownProps.blog),
  user: state.user
})


export default connect(mapStateToProps, { likeBlog, setNotification, removeBlog })(Blog)