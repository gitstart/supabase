import React from "react"
import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart"
import { TimeseriesChartProps } from "../TimeseriesChart.types"

export interface  AreaChartProps extends TimeseriesChartProps{
  onClick?: (v: CategoricalChartState) => void,
}
export interface HeaderType extends Pick<AreaChartProps, 'label' | 'minimalHeader' | 'format' >{
  focus: number | null,
  title?: string,
  subtitle?: React.ReactNode | string,
}
