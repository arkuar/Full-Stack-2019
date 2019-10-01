import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import personService from './services/persons'

const Person = ({ person, handleDelete }) => <div>{person.name} {person.number} <button onClick={() => handleDelete(person)}>delete</button></div>

const Filter = ({ value, handleChange }) => <div>filter shown with <input value={value} onChange={handleChange} /></div>

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

const Persons = ({ persons, handleDelete }) => <div>{persons.map(person => <Person key={person.name} person={person} handleDelete={handleDelete} />)}</div>

const Notification = ({ type, message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={type} >
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterStr, setNewFilter] = useState('')
  const [notificationMsg, setNotificationMsg] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const notificationTimeout = () => {
    setTimeout(() => {
      setNotificationMsg(null)
      setNotificationType(null)
    }, 5000)
  }

  const addNumber = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name.toUpperCase() === newName.toUpperCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name.toUpperCase() === newName.toUpperCase())
        const changedPerson = { ...person, number: newNumber }

        personService
          .update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== changedPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotificationMsg(`Updated ${returnedPerson.name}`)
            setNotificationType('success')
            notificationTimeout()
          })
          .catch(e => {
            setNotificationMsg(`Information of ${changedPerson.name} has already been removed from server`)
            setNotificationType('error')
            setPersons(persons.filter(p => p.id !== changedPerson.id))
            notificationTimeout()
          })
      }
    } else {
      const personObj = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObj)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotificationMsg(`Added ${personObj.name}`)
          setNotificationType('success')
          notificationTimeout()
        })
        .catch(error => {
          setNotificationMsg(error.response.data.error)
          setNotificationType('error')
          notificationTimeout()
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

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setNotificationMsg(`Deleted ${person.name}`)
          setNotificationType('success')
          notificationTimeout()
        })
    }
  }

  const personsToShow = filterStr ? persons.filter(person => person.name.toUpperCase().includes(filterStr.toUpperCase())) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification type={notificationType} message={notificationMsg} />
      <Filter value={filterStr} handleChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm submit={addNumber}
        nameValue={newName}
        numberValue={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
