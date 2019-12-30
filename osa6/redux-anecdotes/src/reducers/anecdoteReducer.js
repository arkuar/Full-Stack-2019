import anecdoteService from '../services/anecdotes'

export const voteAnecdote = (id, votedAnecdote) => {
  return async dispatch => {
    const anecdote = await anecdoteService.update(id, votedAnecdote)
    dispatch({
      type: 'VOTE',
      data: anecdote 
    })
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const anecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: anecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

const reducer = (state = [], action) => {
  // console.log('state now: ', state)
  // console.log('action', action)
  switch(action.type) {
    case 'VOTE': 
      const id = action.data.id
      const votedAnecdote = action.data
      return state.map(anecdote => anecdote.id !== id ? anecdote : votedAnecdote)
    case 'NEW_ANECDOTE':
      return state.concat(action.data)
    case 'INIT_ANECDOTES':
      return action.data
    default: 
      return state
  }
}

export default reducer