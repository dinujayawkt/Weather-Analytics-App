import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

export const fetchComfortRanking = () =>
  api.get('/weather/comfort-ranking').then(r => r.data)

export const fetchCityWeather = (cityId) =>
  api.get(`/weather/city/${cityId}`).then(r => r.data)

export default api
