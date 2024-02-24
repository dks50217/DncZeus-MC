import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getTableData, getDragList, uploadImage } from './data'
import { getMessageInit, getContentByMsgId, hasRead, removeReaded, restoreTrash, messageCount } from './user'

// 配置Ajax請求延時，可用來測試網路延遲大時專案中一些效果
Mock.setup({
  timeout: 1000
})

// 登錄相關和獲取使用者資訊
Mock.mock(/\/login/, login)
Mock.mock(/\/get_info/, getUserInfo)
Mock.mock(/\/logout/, logout)
Mock.mock(/\/get_table_data/, getTableData)
Mock.mock(/\/get_drag_list/, getDragList)
Mock.mock(/\/save_error_logger/, 'success')
Mock.mock(/\/image\/upload/, uploadImage)
Mock.mock(/\/message\/init/, getMessageInit)
Mock.mock(/\/message\/content/, getContentByMsgId)
Mock.mock(/\/message\/has_read/, hasRead)
Mock.mock(/\/message\/remove_readed/, removeReaded)
Mock.mock(/\/message\/restore/, restoreTrash)
Mock.mock(/\/message\/count/, messageCount)

export default Mock
