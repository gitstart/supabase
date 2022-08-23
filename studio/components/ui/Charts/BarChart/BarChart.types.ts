import React from "react"
import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart"
import { TimeseriesChartProps } from "../TimeseriesChart.types"

export interface BarChartProps extends TimeseriesChartProps {
  onBarClick?: (v: CategoricalChartState) => void,
}
export interface HeaderType extends Pick<BarChartProps, 
  'format' | 'label' | 'minimalHeader'>{
  subtitle?: React.ReactNode,
  title: string,
}
