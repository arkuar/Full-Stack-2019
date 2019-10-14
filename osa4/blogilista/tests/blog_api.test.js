const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('when there are initial blogs saved', () => {
  /* Incresed timeout value since default timeout caused tests to fail */
  jest.setTimeout(20000)

  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArr = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArr)
  })

  test('blogs should be returned in JSON', async () => {
    const res = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.length).toBe(helper.initialBlogs.length)
  })

  test('returned blogs should have id property', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Valid blog',
      author: 'Tester',
      url: 'https://jestjs.io/docs/en/tutorial-async#async-await',
      likes: 3
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    expect(blogs.length).toBe(helper.initialBlogs.length + 1)

    const titles = blogs.map(blog => blog.title)
    expect(titles).toContain('Valid blog')
  })
})

describe('when adding a blog', () => {
  test('likes is set to 0 if not defined', async () => {
    const newBlog = {
      title: 'Another valid blog',
      author: 'Tester',
      url: 'https://mongoosejs.com/docs/defaults.html'
    }

    const res = await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(res.body.likes).toBe(0)
  })

  test('if required fields are empty, returns status 400', async () => {
    const invalidBlog = {
      author: 'Not valid'
    }

    await api.post('/api/blogs')
      .send(invalidBlog)
      .expect(400)
  })
})

describe('when deleting', () => {
  jest.setTimeout(20000)

  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArr = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArr)
  })

  test('should return status 204 if id is valid', async () => {
    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAfterDeletion = await helper.blogsInDb()
    expect(blogsAfterDeletion.length).toBe(helper.initialBlogs.length - 1)

    const titles = blogsAfterDeletion.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('when editing a blog', () => {
  jest.setTimeout(20000)

  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArr = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArr)
  })

  test('should return status 200 and updated blog if succesful', async () => {
    const blogs = await helper.blogsInDb()
    const blog = blogs[0]

    const blogToEdit = { ...blog, title: 'Edited' }
    const updated = await api.put(`/api/blogs/${blogToEdit.id}`)
      .send(blogToEdit)
      .expect(200)

    expect(updated.body).toEqual(blogToEdit)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
