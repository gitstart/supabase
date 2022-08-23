import { useState } from 'react'

export const useFocusBar = () => {
  const [focusBar, setFocusBar] = useState<number | null>(null)

  return {focusBar, setFocusBar}
}
