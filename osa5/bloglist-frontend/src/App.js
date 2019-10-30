import React, { useState, useEffect } from 'react'
import loginService from './services/login'
import blogService from './services/blogs'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    async function getBlogs() {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

      getBlogs()
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const createBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)
      const message = `new blog ${createdBlog.title} by ${createdBlog.author} added`
      setMessage(message)
      setBlogs(blogs.concat(createdBlog))
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('error when adding blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const likeBlog = async (event, id) => {
    event.stopPropagation()
    const blog = blogs.find(b => b.id === id)
    const likedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const returnedBlog = await blogService.update(id, likedBlog)
    setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog))
  }

  const removeBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification errorMessage={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} errorMessage={errorMessage} />
      <div>{user.name} logged in <button type='button' onClick={() => logout()}>logout</button></div>
      <Togglable buttonLabel='new note'>
        <BlogForm submitCallback={createBlog} />
      </Togglable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} onLike={likeBlog} onRemove={removeBlog} showRemove={user.username === blog.user.username} />
      )}
    </div>
  )
}

export default App
