import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  console.log('config', config)
  const response = await axios.post(baseUrl, newObject, config)
  console.log('response', response)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deleteBlog = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  console.log('A blog by id ', id, 'was successfully deleted!')
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken, deleteBlog }
