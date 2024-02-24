<template>
  <div class="count-to-wrapper">
    <slot name="left"/>
    <p class="content-outer"><span :class="['count-to-count-text', countClass]" :id="counterId">{{ init }}</span><i :class="['count-to-unit-text', unitClass]">{{ unitText }}</i></p>
    <slot name="right"/>
  </div>
</template>

<script>
import CountUp from 'countup'
import './index.less'
export default {
  name: 'CountTo',
  props: {
    init: {
      type: Number,
      default: 0
    },
    /**
     * @description 起始值，即動畫開始前顯示的數值
     */
    startVal: {
      type: Number,
      default: 0
    },
    /**
     * @description 結束值，即動畫結束后顯示的數值
     */
    end: {
      type: Number,
      required: true
    },
    /**
     * @description 保留幾位小數
     */
    decimals: {
      type: Number,
      default: 0
    },
    /**
     * @description 分隔整數和小數的符號，預設是小數點
     */
    decimal: {
      type: String,
      default: '.'
    },
    /**
     * @description 動畫持續的時間，單位是秒
     */
    duration: {
      type: Number,
      default: 2
    },
    /**
     * @description 動畫延遲開始的時間，單位是秒
     */
    delay: {
      type: Number,
      default: 0
    },
    /**
     * @description 是否禁用easing動畫效果
     */
    uneasing: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否使用分組，分組后每三位會用一個符號分隔
     */
    usegroup: {
      type: Boolean,
      default: false
    },
    /**
     * @description 用於分組(usegroup)的符號
     */
    separator: {
      type: String,
      default: ','
    },
    /**
     * @description 是否簡化顯示，設為true後會使用unit單位來做相關省略
     */
    simplify: {
      type: Boolean,
      default: false
    },
    /**
     * @description 自定義單位，如[3, 'K+'], [6, 'M+']即大於3位數小於6位數的用k+來做省略
     *              1000即顯示為1K+
     */
    unit: {
      type: Array,
      default () {
        return [[3, 'K+'], [6, 'M+'], [9, 'B+']]
      }
    },
    countClass: {
      type: String,
      default: ''
    },
    unitClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      counter: null,
      unitText: ''
    }
  },
  computed: {
    counterId () {
      return `count_to_${this._uid}`
    }
  },
  methods: {
    getHandleVal (val, len) {
      return {
        endVal: parseInt(val / Math.pow(10, this.unit[len - 1][0])),
        unitText: this.unit[len - 1][1]
      }
    },
    transformValue (val) {
      let len = this.unit.length
      let res = {
        endVal: 0,
        unitText: ''
      }
      if (val < Math.pow(10, this.unit[0][0])) res.endVal = val
      else {
        for (let i = 1; i < len; i++) {
          if (val >= Math.pow(10, this.unit[i - 1][0]) && val < Math.pow(10, this.unit[i][0])) res = this.getHandleVal(val, i)
        }
      }
      if (val > Math.pow(10, this.unit[len - 1][0])) res = this.getHandleVal(val, len)
      return res
    },
    getValue (val) {
      let res = 0
      if (this.simplify) {
        let { endVal, unitText } = this.transformValue(val)
        this.unitText = unitText
        res = endVal
      } else {
        res = val
      }
      return res
    }
  },
  mounted () {
    this.$nextTick(() => {
      let endVal = this.getValue(this.end)
      this.counter = new CountUp(this.counterId, this.startVal, endVal, this.decimals, this.duration, {
        useEasing: !this.uneasing,
        useGrouping: this.useGroup,
        separator: this.separator,
        decimal: this.decimal
      })
      setTimeout(() => {
        if (!this.counter.error) this.counter.start()
      }, this.delay)
    })
  },
  watch: {
    end (newVal) {
      let endVal = this.getValue(newVal)
      this.counter.update(endVal)
    }
  }
}
</script>
