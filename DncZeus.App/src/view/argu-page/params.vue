<template>
  <div>
    <Card>
      <h2>ID: {{ $route.params.id }}</h2>
      <Button @click="close">呼叫closeTag方法關閉本頁</Button>
    </Card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'params',
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    close () {
      /**
       * 如果是呼叫closeTag方法，普通的頁面傳入的對象參數只需要寫name欄位即可
       * 如果是動態路由和帶參路由，需要傳入query或params欄位，用來區別關閉的是參數為多少的頁面
       */
      this.closeTag({
        name: 'params',
        params: {
          id: this.$route.params.id
        }
      })
    }
  }
}
</script>

<style>

</style>
