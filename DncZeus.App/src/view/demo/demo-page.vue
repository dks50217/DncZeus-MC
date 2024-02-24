<template>
  <div>
    <h1>這是一個用於演示的頁面</h1>
    <Button v-can="'create'" icon="md-create" type="primary" title="新增使用者">新增(有許可權才顯示)</Button>
  </div>
</template>

<script>
export default {
  name: 'demo_page',
  data () {
    return {

    }
  }
}
</script>
