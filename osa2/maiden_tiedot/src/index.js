import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import axios from 'axios'

const APIXUKEY = 'YOUR_KEY_HERE'

const Filter = ({value, handleChange}) => {
  return (
    <div>
      find countries <input value={value} onChange={handleChange} />
    </div>
  )
}

const Weather = ({ country }) => {
  const [weatherData, setWeatherData] = useState({})

  useEffect(() => {
    const params = {
      access_key: APIXUKEY,
      query: country.capital
    }
    axios
      .get('http://api.weatherstack.com/current', { params })
      .then(response => {
        setWeatherData(response.data.current)
      })
  }, [country.capital])

  if (weatherData && Object.keys(weatherData).length > 0) {
    return (
      <div>
        <h3>Weather in {country.capital}</h3>
        <p>temperature: {weatherData.temperature} Celsius</p>
        <img src={weatherData.weather_icons[0]} alt='weathericon' />
        <p>wind: {weatherData.wind_speed} kph direction {weatherData.wind_dir}</p>
      </div>
    )
  }
  if (APIXUKEY === 'YOUR_KEY_HERE') {
    return (
      <div>No API key provided, unable to fetch weather data</div>
    )
  }

  return (
    <div>Loading weather data...</div>
  )
}

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {country.languages.map(lang => <li key={lang.name}>{lang.name}</li>)}
      </ul>
      <img src={country.flag} alt={country.name} height='100' />
      <Weather country={country} />
    </div>
  )
}

const CountryList = ({ countries }) => {
  const [countryToShow, setCountryToShow] = useState('')

  const showCountry = (country) => {
    if (country === countryToShow) {
      setCountryToShow('')
    } else {
      setCountryToShow(country)
    }
  }

  const rows = () => {
    return countries.map(country => {
      if (countryToShow === country.name) {
        return <Country key={country.name} country={country} />
      }
      return <li key={country.name}>{country.name} <button onClick={() => showCountry(country.name)}>Show</button></li>
    })
  }

  if (countries.length === 1) {
    return (
      <Country country={countries[0]} />
    )
  }
  if (countries.length <= 10) {
    return (
      <ul>
        {rows()}
      </ul>
    )
  }
  return (
    <div>Too many matches, specify another filter</div>
  )
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const filterChangeEvent = (event) => {
    setFilter(event.target.value)
  }

  const filteredCountries = countries.filter(country => country.name.toUpperCase().includes(filter.toUpperCase()))

  return (
    <div>
      <Filter value={filter} handleChange={filterChangeEvent} />
      <CountryList countries={filteredCountries} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
