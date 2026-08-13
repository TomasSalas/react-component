import { useRef } from 'react'

let idCounter = 0

export function useId () {
  const idRef = useRef(null)

  if (idRef.current === null) {
    idRef.current = `component-id-${idCounter++}`
  }

  return idRef.current
}
