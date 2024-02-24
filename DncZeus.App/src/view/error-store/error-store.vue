<template>
  <div>
    <Card>
      iview-admin會自動將你程式中的錯誤收集起來，你可以將錯誤日誌發給後端儲存起來。如果你不需要這個功能，將'./src/config/index.js'里的plugin的'error-store'屬性刪掉即可。
      另外在開發環境下，你程式中的錯誤都會被收集起來，這樣可能不利於你排查錯誤，你可以將'./src/config/index.js'的'error-store'的'developmentOff'設為true。
      如果你只是想收集錯誤日誌，不希望登錄使用者看到錯誤日誌，你可以不提供檢視日誌的入口，只需將'./src/config/index.js'的'error-store'的'showInHeader'設為false。
    </Card>
    <Card style="margin-top: 20px;">
      <Row>
        <i-col span="8">
          <Button @click="click" style="display: block">點選測試觸發程式錯誤</Button>
          <Button @click="ajaxClick" style="margin-top:10px;">點選測試觸發ajax介面請求錯誤</Button>
        </i-col>
        <i-col span="16">
          ajax介面請求是請求easy-mock的一個不存在介面，所以服務端會報404錯誤，錯誤收集機制會收集這個錯誤，測試的時候有一定網路延遲，所以點選按鈕之後稍等一會才會收集到錯誤。
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { errorReq } from '@/api/data'
export default {
  name: 'error_store_page',
  methods: {
    click () {
      console.log(admin)
    },
    ajaxClick () {
      errorReq()
    }
  }
}
</script>

<style>

</style>
