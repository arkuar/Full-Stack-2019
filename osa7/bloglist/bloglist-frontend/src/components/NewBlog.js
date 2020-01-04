import React from 'react'
import { useField } from '../hooks'
import { createBlog } from '../reducers/blogReducer'
import { connect } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { Form, Button } from 'semantic-ui-react'

const NewBlog = (props) => {
  const [title, titleReset] = useField('text')
  const [author, authorReset] = useField('text')
  const [url, urlReset] = useField('text')

  const handleSubmit = async (event) => {
    event.preventDefault()
    props.createBlog({
      title: title.value,
      author: author.value,
      url: url.value
    })
    props.setNotification({
      message: `a new blog ${title.value} by ${author.value} added`
    }, 10)
    titleReset()
    authorReset()
    urlReset()
  }

  return (
    <div>
      <h2>create new</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>title</label>
            <input placeholder='Title' {...title} />
          </Form.Field>
          <Form.Field>
            <label>author</label>
            <input placeholder='Author' {...author} />
          </Form.Field>
          <Form.Field>
            <label>url</label>
            <input placeholder='URL' {...url} />
          </Form.Field>
        </Form.Group>
        <Button primary type='submit'>create</Button>
      </Form>
    </div>
  )
}

export default connect(null, { createBlog, setNotification })(NewBlog)