import React, { useState, useEffect } from 'react';
import loginService from './services/login'
import blogService from './services/blogs'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      
      async function getBlogs() {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      }

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
      console.log(exception)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const createBlog = async (blog) => {
    const createdBlog = await blogService.create(blog)
    setBlogs(blogs.concat(createdBlog))
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
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
      <div>{user.name} logged in <button type="button" onClick={() => logout()}>logout</button></div>
      <BlogForm submitCallback={createBlog} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  );
}

export default App;
