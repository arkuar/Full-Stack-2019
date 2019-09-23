import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import axios from 'axios'

const Person = ({ person }) => {
  return (
    <p>{person.name} {person.number}</p>
  )
}

const Filter = ({ value, handleChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={handleChange} />
    </div>
  )
}

const PersonForm = ({ submit, nameValue, numberValue, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={submit}>
      <div>
        name: <input value={nameValue} onChange={handleNameChange} required />
      </div>
      <div>
        number: <input value={numberValue} onChange={handleNumberChange} required />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map(person => <Person key={person.name} person={person} />)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterStr, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addNumber = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name.toUpperCase() === newName.toUpperCase())) {
      window.alert(`${newName} is already added to phonebook`)
    } else {
      const personObj = {
        name: newName,
        number: newNumber
      }
      axios
        .post('http://localhost:3001/persons', personObj)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = filterStr ? persons.filter(person => person.name.toUpperCase().includes(filterStr.toUpperCase())) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterStr} handleChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm submit={addNumber}
        nameValue={newName}
        numberValue={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
