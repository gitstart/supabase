import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AreaChart from '.'

export default {
  title: 'Charts/AreaChart',
  component: AreaChart,
} as ComponentMeta<typeof AreaChart>

const Template: ComponentStory<typeof AreaChart> = (args) => <AreaChart {...{
  data: [290, 430, 649, 422, 321, 893, 111].map(value => ({ram_usage : value})),
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
  highlightedValue: 430,
}

export const withCustomDateFormat = Template.bind({})
withCustomDateFormat.args = {
  customDateFormat: 'MMM D, YYYY',
}
