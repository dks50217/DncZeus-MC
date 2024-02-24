<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '@/libs/tools'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 繫結的值的型別, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 設定change事件觸發時間間隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否開啟本地儲存
     */
    cache: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  methods: {
    setHtml (val) {
      this.editor.txt.html(val)
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
      let text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    // create這個方法一定要在所有配置項之後呼叫
    this.editor.create()
    // 如果本地有儲存載入本地儲存內容
    let html = this.value || localStorage.editorCache
    if (html) this.editor.txt.html(html)
  }
}
</script>

<style lang="less">
.editor-wrapper *{
  z-index: 100 !important;
}
</style>
