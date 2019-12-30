import React from 'react'
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { notificationChange } from '../reducers/notificationReducer'


const AnecdoteList = (props) => {
  const vote = (id, content) => {
    props.voteAnecdote(id)
    props.notificationChange(`you voted '${content}'`)
    setTimeout(() => props.notificationChange(''), 5000)
  }

  return (
    <div>
      {props.anecdotesToShow.sort((a, b) => b.votes - a.votes)
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

const mapStateToProps = (state) => {
  return {
    anecdotesToShow: state.anecdotes.filter(a => a.content.includes(state.filter))
  }
}

const mapDispatchToProps = {
  voteAnecdote,
  notificationChange
}

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)