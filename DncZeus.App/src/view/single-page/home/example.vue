<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['週一', '週二', '週三', '週四', '週五', '週六', '週日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '運營商/網路服務',
          type: 'line',
          stack: '總量',
          areaStyle: {normal: {
            color: '#2d8cf0'
          }},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '銀行/證券',
          type: 'line',
          stack: '總量',
          areaStyle: {normal: {
            color: '#10A6FF'
          }},
          data: [257, 358, 278, 234, 290, 330, 310]
        },
        {
          name: '遊戲/視訊',
          type: 'line',
          stack: '總量',
          areaStyle: {normal: {
            color: '#0C17A6'
          }},
          data: [379, 268, 354, 269, 310, 478, 358]
        },
        {
          name: '餐飲/外賣',
          type: 'line',
          stack: '總量',
          areaStyle: {normal: {
            color: '#4608A6'
          }},
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '快遞/電商',
          type: 'line',
          stack: '總量',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: {normal: {
            color: '#398DBF'
          }},
          data: [820, 645, 546, 745, 872, 624, 258]
        }
      ]
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
