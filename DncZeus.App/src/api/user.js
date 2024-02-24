import _axios from 'axios'
import config from '@/config'
import axios from '@/libs/api.request'

const authUrl = process.env.NODE_ENV === 'development' ? config.authUrl.dev : config.authUrl.pro

export const login = ({
  userName,
  password
}) => {
  return _axios.get(authUrl + '?username=' + userName + '&password=' + password)
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'account/profile',
    method: 'get',
    //是否在請求資源中新增資源的字首
    withPrefix: false,  //設定為true或者不設定此屬性，將預設新增配置檔案config.baseUrl.defaultPrefix的字首，如果設定下面這個屬性[prefix]，預設配置檔案中的預設字首將不生效
    //請求資源的字首重寫
    prefix:"api/v1/"    //設此屬性權重最高，將覆蓋配置檔案[baseUrl.defaultPrefix]中的字首，withPrefix對此屬性不起作用(也就是說只要設定了此屬性，都將在請求中新增設定的字首)
  })
}

export const logout = (token) => {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    hideError: false,
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content/' + msg_id,
    method: 'get'
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read/' + msg_id,
    method: 'get',
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed/' + msg_id,
    method: 'get'
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore/' + msg_id,
    method: 'get'
  })
}
