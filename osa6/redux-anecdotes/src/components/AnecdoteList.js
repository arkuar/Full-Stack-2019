import React from 'react'
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'


const AnecdoteList = (props) => {
  const vote = (anecdote) => {
    anecdote.votes++
    props.voteAnecdote(anecdote.id, anecdote)
    props.setNotification(`you voted '${anecdote.content}'`, 5000)
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
              <button onClick={() => vote(anecdote)}>vote</button>
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
  setNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)