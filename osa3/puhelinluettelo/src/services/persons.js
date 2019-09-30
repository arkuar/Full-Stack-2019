import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = newObj => {
  return axios.post(baseUrl, newObj).then(response => response.data)
}

const deletePerson = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, newObj) => {
  return axios.put(`${baseUrl}/${id}`, newObj).then(response => response.data)
}

export default { getAll, create, deletePerson, update }
