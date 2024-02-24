<template>
  <div>
    <Row>
      <i-col span="8">
        <Card title="DncZeus/.NET Core交流群" shadow>
          <img class="qq-group-img" :src="qqFans" alt="">
          <p class="qq-join">QQ掃一掃二維碼加群</p>
          <p class="qq-group-intro">本群為使用DncZeus/.NET Core或者對DncZeus/.NET Core感興趣的開發者提供交流平臺。在這裡，解決你開發中的疑惑，共同進步。</p>
          <p class="addtional">
            本框架 <a href="https://github.com/lampo1024/DncZeus" target="_blank">[DncZeus]</a> 由 <a href="https://codedefault.com" target="_blank">碼友網</a> 建立者<b>Rector</b>主導開發和維護。
          </p>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import qqFans from '@/assets/images/qq-group1.jpg'
export default {
  name: 'join_page',
  data () {
    return {
      qqFans
    }
  }
}
</script>

<style>
.qq-join{color: #999; text-align: center;}
.qq-group-img{
  display: block;
  margin: 0 auto;
  width: 240px;
}
.qq-group-intro{
  padding: 20px;
  font-size: 16px;
}
.addtional{padding: 20px; color: #777;}
</style>
