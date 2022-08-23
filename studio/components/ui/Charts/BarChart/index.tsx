import { IconBarChart2, Loading } from '@supabase/ui'
import {
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'

import dayjs from 'dayjs'
import { formatBytes } from 'lib/helpers'
import utc from 'dayjs/plugin/utc'
import { CHART_COLORS } from '../Charts.constants'
import { BarChartProps, HeaderType } from './BarChart.types'
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart'
import { isNumber } from 'lodash'
import { useFocusBar, useMouseEvent } from 'hooks/ui'

function dataCheck(data: BarChartProps['data'] | undefined, attribute: string) {
  const hasData = data?.find(record => record[attribute])
  return hasData ? true : false
}

const CustomTooltip = () => null
const DATE_FORMAT__DATE_ONLY = 'MMM D, YYYY'
const DATE_FORMAT__WITH_TIME = `${DATE_FORMAT__DATE_ONLY}, hh:mma`

const Header = ({
  format,
  label,
  minimalHeader = false,
  subtitle,
  title,
}: HeaderType) => {


  const chartTitle = (
    <h3 className={`text-scale-900 ${minimalHeader ? 'text-xs' : 'text-sm'}`}>
      {label}
    </h3>
  )
  const highlighted = (
    <h5
      className={
        `text-scale-1200 text-xl font-normal  ${minimalHeader ? 'text-base' : 'text-2xl'}`
      }
    >
      {title}
      <span className="text-lg">{format}</span>
    </h5>
  )
  

  if (minimalHeader) {
    return (
      <div className="flex flex-row items-center gap-x-4" style={{ minHeight: '1.8rem' }}>
        {chartTitle}
        <div className="flex flex-row items-baseline gap-x-2">
          {highlighted}
          {subtitle}
        </div>
      </div>
    )
  }

  return (
    <>
      {chartTitle}
      {highlighted}
      {subtitle}
    </>
  )
}

const NoData = ({ title = 'No data to show', message = 'May take 24 hours for data to show' }) => (
  <div className="border-scale-600 flex h-full w-full flex-col items-center justify-center space-y-2 border border-dashed text-center">
    <IconBarChart2 className="text-scale-800" />
    <div>
      <p className="text-scale-1100 text-xs">{title}</p>
      <p className="text-scale-900 text-xs">{message}</p>
    </div>
  </div>
)

const BarChart : React.FC<BarChartProps> = ({
    data,
    attribute, 
    displayDateInUtc = false,
    chartSize = 'normal', 
    className = '',  
    minimalHeader,
    highlightedValue,
    format,
    label,
    customDateFormat,
    onBarClick,
    noDataTitle,
    yAxisLimit,
    noDataMessage,
  }: BarChartProps) => {
  const hasData = data ? dataCheck(data, attribute) : true
  const FOCUS_FORMAT = customDateFormat
  ? customDateFormat
  : format == '%'
  ? DATE_FORMAT__WITH_TIME
  : DATE_FORMAT__DATE_ONLY

  const {focusBar, setFocusBar} = useFocusBar()
  const {onMouseLeave, onMouseMove, mouseLeave} = useMouseEvent(setFocusBar)

  dayjs.extend(utc);
  const day = (value: number | string) => (displayDateInUtc ? dayjs(value).utc() : dayjs(value))

  // For future reference: https://github.com/supabase/supabase/pull/5311#discussion_r800852828
  const chartHeight = {
    tiny: 76,
    small: 96,
    normal: 160,
  }[chartSize as string] as number

  let title = ''
  const ingressEgressOrBytes = ['ingress', 'egress', 'bytes'].some(str =>  attribute.includes(str))

  if (focusBar) {
    if (format === '%') {
      title = data ? Number(data[focusBar]?.[attribute]).toFixed(2)  : ''
    } else if (ingressEgressOrBytes) {
      title = data ? formatBytes(data[focusBar]?.[attribute]) : ''
    } else {
      title = data ? data[focusBar]?.[attribute]?.toLocaleString() : ''
    }
  } else {
    if ((format === '%') && highlightedValue) {
      title = isNumber(highlightedValue) ? highlightedValue.toFixed(2) : highlightedValue
    } else if (ingressEgressOrBytes) {
      title = formatBytes(highlightedValue)
    } else {
      title = highlightedValue?.toLocaleString() as string
    }
  }

  const subtitle = (
    <h5 className="text-scale-900 text-xs">
      {focusBar ? (
        data?.[focusBar] && day(data[focusBar].period_start).format(FOCUS_FORMAT)
      ) : (
        <span className="opacity-0">x</span>
      )}
    </h5>
  )

  return (
    <Loading active={!data}>
      <div className={className}>
        <Header
          minimalHeader={minimalHeader}
          label={label}
          format={format}
          subtitle = {subtitle}
          title= {title}
        />
        <div style={{ width: '100%', height: `${chartHeight}px` }}>
          {hasData ? (
            <>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <RechartBarChart
                  data={data}
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                  className="cursor-pointer overflow-visible"
                  onMouseMove={onMouseMove}
                  onMouseLeave={onMouseLeave}
                  onClick={(tooltipData: CategoricalChartState) => {
                    // receives tooltip data https://github.com/recharts/recharts/blob/2a3405ff64a0c050d2cf94c36f0beef738d9e9c2/src/chart/generateCategoricalChart.tsx
                    onBarClick?.(tooltipData)
                  }}
                >
                  <XAxis
                    dataKey="period_start"
                    //interval={size === 'small' ? 5 : 1}
                    interval={data ? data.length - 2 : 0}
                    angle={0}
                    // stroke="#4B5563"
                    tick={{ fontSize: '0px', color: CHART_COLORS.TICK }}
                    axisLine={{ stroke: CHART_COLORS.AXIS }}
                    tickLine={{ stroke: CHART_COLORS.AXIS }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {/* <YAxis dataKey={attribute} /> */}
                  {/* <YAxis type="number" domain={[(0, 100)]} /> */}
                  {yAxisLimit && <YAxis type="number" domain={[0, yAxisLimit]} hide />}
                  <Bar
                    dataKey={attribute}
                    fill={CHART_COLORS.GREEN_1}
                    // barSize={2}
                    animationDuration={300}
                  >
                    {data?.map((_entry, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        className={`transition-all duration-300 ${
                          onBarClick ? 'cursor-pointer' : ''
                        }`}
                        fill={
                          focusBar === index || mouseLeave
                            ? CHART_COLORS.GREEN_1
                            : CHART_COLORS.GREEN_2
                        }
                        enableBackground={12}
                        // for this, we make the hovered colour #2B5CE7, else its opacity decreases to 20%
                      />
                    ))}
                  </Bar>
                </RechartBarChart>
              </ResponsiveContainer>
              {data && (
                <div className="text-scale-900 -mt-5 flex items-center justify-between text-xs">
                  <span>
                    {day(data[0].period_start).format(
                      customDateFormat ?? DATE_FORMAT__WITH_TIME
                    )}
                  </span>
                  <span>
                    {day(data[data?.length - 1]?.period_start).format(
                      customDateFormat ?? DATE_FORMAT__WITH_TIME
                    )}
                  </span>
                </div>
              )}
            </>
          ) : (
            <NoData title={noDataTitle} message={noDataMessage} />
          )}
        </div>
      </div>
    </Loading>
  )
}

export default BarChart;
