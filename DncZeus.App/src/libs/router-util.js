import { getToken, hasChild, localSave, localRead } from '@/libs/util'
import Main from '@/components/main'
import parentView from '@/components/parent-view'
// import axios from 'axios'
import axios from '@/libs/api.request'
import config from '@/config'
import { forEach } from '@/libs/tools'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

// 初始化路由
export const initRouter = (vm) => {
  // if (!getToken()) {
  //   return
  // }
  let list = []
  // 模擬非同步請求，改為您實際的後端請求路徑
  // axios.get(baseUrl + 'system/permission/userMenuList', {
  //   headers: { 'Authorization': 'Bearer ' + getToken() }
  // })

  axios.request({
    url: 'account/menu',
    method: 'get'
  }).then(res => {
    var menuData = res.data
    // 格式化菜單
    list = formatMenu(menuData)
    // 重新整理界面菜單
    //vm.$store.commit('setMenuList', list)
    vm.$store.commit('refreshMenuList', list)
  });

  return list
}

// 載入菜單，在建立路由時使用
export const loadMenu = () => {
  let list = []
  axios.request({
    url: 'account/menu',
    method: 'get'
  }).then(res => {
    var menuData = res.data
    // 這是後端回傳給前端的數據，如上面所說的
    // 格式化菜單
    list = formatMenu(menuData)
  });

  return list
}

// 格式化菜單
export const formatMenu = (list) => {
  let res = []
  forEach(list, item => {
    let obj = {
      path: item.path,
      name: item.name,
      icon: (item.meta && item.meta.icon) || ''
    }
    obj.meta = item.meta
    //obj.meta.showAlways = true;
    // 惰性遞迴 ****
    if (item.parentId === "0") {
      obj.component = Main
    } else {
      // 惰性遞迴 ****
      let data = item.component
      if(item.children.length>0){
        obj.component = parentView
      }else{
        // 這裡需要改成自己定義的 .vue 路徑
        obj.component = () => import('@/view' + data)
      }
    }
    if (hasChild(item)) {
      obj.children = formatMenu(item.children)
    }
    res.push(obj)
  })
  return res
}
