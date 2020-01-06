import React from 'react'
import { likeBlog, removeBlog, commentBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'
import { useField } from '../hooks/index'
import { Button, Icon, Card, Form, Comment, Header, Statistic } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'

const Blog = (props) => {
  const [comment, resetComment] = useField('text')

  if (props.blog === undefined) {
    return null
  }

  const handleComment = async (event) => {
    event.preventDefault()
    props.commentBlog(props.blog.id, comment.value)
    props.setNotification({
      message: `commented blog ${props.blog.title}`
    }, 10)
    resetComment()
  }

  const like = async (blog) => {
    props.likeBlog(blog)
    props.setNotification({
      message: `blog ${blog.title} by ${blog.author} liked!`
    }, 10)
  }

  const remove = async (blog) => {
    const ok = window.confirm(`remove blog ${blog.title} by ${blog.author}`)
    if (ok) {
      props.removeBlog(blog)
      props.setNotification({
        message: `blog ${blog.title} by ${blog.author} removed!`
      }, 10)
      props.history.push('/')
    }
  }

  return (
    <Card fluid data-cy='blogCard'>
      <Card.Content>
        <Card.Header>{props.blog.title} {props.blog.author}</Card.Header>
        <div><a href={props.blog.url}>{props.blog.url}</a></div>
        <Statistic size='mini' data-cy='blogLikes'>
          <Statistic.Value>{props.blog.likes}</Statistic.Value>
          <Statistic.Label>likes</Statistic.Label>
        </Statistic>
        <Button onClick={() => like(props.blog)} data-cy='likeButton'>
          <Icon name='like' />
          like
        </Button>
        <div>added by {props.blog.user.name}
          {props.user.username === props.blog.user.username ? <Button data-cy='removeButton' negative onClick={() => remove(props.blog)}>remove </Button> : null}
        </div>
        <Comment.Group data-cy='comments'>
          <Header data-cy='commentsHeader' as='h3' dividing>comments</Header>
          <Form onSubmit={handleComment}>
            <Form.Group>
              <Form.Field>
                <input data-cy='commentInput' {...comment} />
              </Form.Field>
              <Button type='submit' data-cy='addComment'>add comment</Button>
            </Form.Group>
          </Form>
          {props.blog.comments.map(c =>
            <Comment key={c}>
              <Comment.Content>
                <Comment.Text>{c}</Comment.Text>
              </Comment.Content>
            </Comment>)}
        </Comment.Group>
      </Card.Content>
    </Card>
  )
}

const mapStateToProps = (state, ownProps) => ({
  blog: state.blogs.find(b => b.id === ownProps.blog),
  user: state.user
})


export default connect(mapStateToProps, { likeBlog, setNotification, removeBlog, commentBlog })(withRouter(Blog))