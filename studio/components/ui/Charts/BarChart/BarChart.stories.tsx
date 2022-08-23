import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions';
import BarChart from '.'

export default {
  title: 'Charts/BarChart',
  component: BarChart,
} as ComponentMeta<typeof BarChart>



const Template: ComponentStory<typeof BarChart> = (args) => <BarChart  {...{
  onBarClick: action('clicked'),
  className: 'ram-bar-chart',
  data : [290, 430, 620, 67, 354, 123, 627, 122].map(val => ({ "ram_usage": val})),
  ...args,
  attribute: 'ram_usage',
  label: 'Memory usage',
}} />

export const Default = Template.bind({})

export const withYAxisLimit = Template.bind({})
withYAxisLimit.args = {
  yAxisLimit: 'dataMax + 1000',
}

export const withFormat = Template.bind({})
withFormat.args = {
  format: '%',
}

export const withHighlightedValue = Template.bind({})
withHighlightedValue.args = {
  highlightedValue:  430,
}

export const withCustomDateFormat = Template.bind({})
withCustomDateFormat.args = {
  customDateFormat: 'MMM D, YYYY',
}

export const withDisplayDateInUtc = Template.bind({})
withDisplayDateInUtc.args = {
  displayDateInUtc: true,
}

export const withMinimalHeader = Template.bind({})
withMinimalHeader.args = {
  minimalHeader: true,
}

export const withChartSizeSmall = Template.bind({})
withChartSizeSmall.args = {
  chartSize: 'small',
}

export const withChartSizeTiny = Template.bind({})
withChartSizeTiny.args = {
  chartSize: 'tiny',
}

export const withNoData = Template.bind({})
withNoData.args = {
  noDataTitle: 'No data Found',
  noDataMessage: "This is strange, we're looking into it",
  data : []
}
