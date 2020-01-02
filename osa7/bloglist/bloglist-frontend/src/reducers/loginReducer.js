/* eslint-disable indent */
const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.data
    case 'CLEAR_USER':
      return null
    default:
      return state
  }
}

export const setUser = (user) => (
  {
    type: 'SET_USER',
    data: user
  }
)

export const clearUser = () => (
  {
    type: 'CLEAR_USER'
  }
)

export default reducer