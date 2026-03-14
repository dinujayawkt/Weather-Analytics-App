import { createContext, useContext, useState } from 'react'

export const SearchContext = createContext({
  searchQuery: '', setSearchQuery: () => {},
  submittedQuery: '', submitSearch: () => {},
})

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  const submitSearch = (query) => setSubmittedQuery(query)

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, submittedQuery, submitSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  return useContext(SearchContext)
}
