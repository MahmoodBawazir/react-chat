import { useState } from 'react'

const useAccordionState = () => {
  const [expanded, setExpanded] = useState(true)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return [expanded, toggleExpanded]
}

export default useAccordionState
