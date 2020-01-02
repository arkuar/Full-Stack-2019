/* eslint-disable indent */
import blogService from '../services/blogs'

const byLikes = (b1, b2) => b2.likes - b1.likes

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_BLOG':
      return state.concat(action.data).sort(byLikes)
    case 'INITIALIZE':
      return action.data.sort(byLikes)
    case 'LIKE_BLOG':
      return state.map(b => b.id !== action.data.id ? b : action.data).sort(byLikes)
    case 'DELETE_BLOG':
      return state.filter(b => b.id !== action.data.id).sort(byLikes)
    default:
      return state
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    const liked = { ...blog, likes: blog.likes + 1 }
    const data = await blogService.update(liked)
    dispatch({
      type: 'LIKE_BLOG',
      data
    })
  }
}

export const removeBlog = (blog) => {
  return async dispatch => {
    await blogService.remove(blog)
    dispatch({
      type: 'DELETE_BLOG',
      data: blog
    })
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const data = await blogService.getAll()
    dispatch({
      type: 'INITIALIZE',
      data
    })
  }
}

export default reducer