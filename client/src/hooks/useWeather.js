import { useState, useEffect, useCallback } from 'react'
import { fetchComfortRanking, fetchCityWeather } from '../services/api'

export function useRankings() {
  const [data, setData] = useState(null)
  const [cacheStatus, setCacheStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchComfortRanking()
      setData(res.data)
      setCacheStatus(res.cache)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { data, cacheStatus, loading, error, refetch: load }
}

export function useCityWeather(cityId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!cityId) return
    setLoading(true)
    setError(null)
    fetchCityWeather(cityId)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [cityId])

  return { data, loading, error }
}
