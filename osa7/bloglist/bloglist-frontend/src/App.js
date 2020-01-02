import React, { useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import Menu from './components/Menu'
import { useField } from './hooks'
import { setNotification } from './reducers/notificationReducer'
import { connect } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initUsers } from './reducers/userReducer'
import { setUser } from './reducers/loginReducer'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const App = (props) => {
  const [username, usernameReset] = useField('text')
  const [password, passwordReset] = useField('password')

  useEffect(() => {
    props.initializeBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      props.setUser(user)
      blogService.setToken(user.token)
      props.initUsers()
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      props.setUser(user)
      usernameReset()
      passwordReset()
    } catch (exception) {
      props.setNotification('wrong username or password', 'error', 10)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (props.user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <Notification notification={props.notification} />

        <form onSubmit={handleLogin}>
          <div>
            käyttäjätunnus
            <input {...username} />
          </div>
          <div>
            salasana
            <input {...password} />
          </div>
          <button type='submit'>kirjaudu</button>
        </form>
      </div>
    )
  }

  const newBlogRef = React.createRef()

  return (
    <div>
      <Router>
        <Menu />
        <h2>blogs</h2>

        <Notification notification={props.notification} />

        <Route exact path='/' render={() =>
          <div>
            <Togglable buttonLabel='create new' ref={newBlogRef}>
              <NewBlog />
            </Togglable>
            {props.blogs.map(blog =>
              <div style={blogStyle} key={blog.id}>
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title} {blog.author}
                </Link>
              </div>
            )}
          </div>} />
        <Route exact path='/users' render={() => <Users />} />
        <Route exact path='/users/:id' render={({ match }) =>
          <User user={match.params.id} />
        } />
        <Route exact path='/blogs/:id' render={({ match }) =>
          <Blog blog={match.params.id} />
        } />
      </Router>
    </div>
  )
}

const mapStateToProps = (state) => ({
  blogs: state.blogs,
  user: state.user
})

export default connect(mapStateToProps, { setNotification, initializeBlogs, setUser, initUsers })(App)