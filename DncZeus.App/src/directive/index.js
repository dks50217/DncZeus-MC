import directive from './directives'

const importDirective = Vue => {
  /**
   * 拖拽指令 v-draggable="options"
   * options = {
   *  trigger: /這裡傳入作為拖拽觸發器的CSS選擇器/,
   *  body:    /這裡傳入需要移動容器的CSS選擇器/,
   *  recover: /拖動結束之後是否恢復到原來的位置/
   * }
   */
  Vue.directive('draggable', directive.draggable)
  /**
   * clipboard指令 v-draggable="options"
   * options = {
   *  value:    /在輸入框中使用v-model繫結的值/,
   *  success:  /複製成功后的回撥/,
   *  error:    /複製失敗后的回撥/
   * }
   */
  Vue.directive('clipboard', directive.clipboard)
}

export default importDirective
