import { useState } from 'react'
import { META } from '#utils/env.js'

export { Counter }

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button type='button' onClick={() => setCount((count) => count + 1)}>
      Counter {count}
      <p>{META.DEFAULT_DESCRIPTION}</p>
    </button>
  )
}
