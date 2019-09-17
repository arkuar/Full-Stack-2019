import React from 'react'

const Header = ({ course }) => <h1>{course.name}</h1>

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) => {
  const elements = () => parts.map(part =>
    <Part key={part.id} part={part} />
  )

  return (
    <div>
      {elements()}
    </div>
  )
}

const Total = ({ parts }) => {
  const count = parts.reduce((acc, part) => acc + part.exercises, 0)
  return (
    <h4>Number of exercises {count}</h4>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course
