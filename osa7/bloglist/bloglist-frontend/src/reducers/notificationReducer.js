const initialState = {
  message: '',
  type: ''
}

const reducer = (state = initialState, action) => {
  if (action.type === 'SET_NOTIFICATION') {
    return action.data
  } else if (action.type === 'CLEAR_NOTIFICATION') {
    return {
      message: '',
      type: ''
    }
  }
  return state
}

export const setNotification = ({ message, type = 'success' }, seconds) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        message,
        type
      }
    })
    setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION'
      })
    }, seconds*1000)
  }

}

export const clearNotification = () => (
  {
    type: 'CLEAR_NOTIFICATION'
  }
)

export default reducer