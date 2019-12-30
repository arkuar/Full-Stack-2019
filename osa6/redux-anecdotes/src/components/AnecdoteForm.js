import React from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = ({ store }) => {
  const addAnecdote = (event) => {
    event.preventDefault()
    console.log(event.target)
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    store.dispatch(createAnecdote(content))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='anecdote' /></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm