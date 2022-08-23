import { useState } from 'react'
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart'

export const useMouseEvent = (setFocusBar: any) => {
  const [mouseLeave, setMouseLeave] = useState(true)

  const onMouseMove = (state: CategoricalChartState) => {
    const {activeTooltipIndex} = state
    setFocusBar(activeTooltipIndex || null)
    setMouseLeave(activeTooltipIndex ? false : true)
  }

  const onMouseLeave = () => {
    setFocusBar(false)
    setMouseLeave(true)
  }
  return {onMouseLeave, onMouseMove, mouseLeave}
}
