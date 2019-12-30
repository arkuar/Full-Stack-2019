import React from 'react'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { notificationChange } from '../reducers/notificationReducer'


const AnecdoteList = ({ store }) => {
  const { anecdotes, filter } = store.getState()

  const vote = (id, content) => {
    store.dispatch(voteAnecdote(id))
    store.dispatch(notificationChange(`you voted '${content}'`))
    setTimeout(() => store.dispatch(notificationChange('')), 5000)
  }

  return (
    <div>
      {anecdotes.filter(a => a.content.includes(filter))
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
            </div>
          </div>
        )}
    </div>
  )
}

export default AnecdoteList