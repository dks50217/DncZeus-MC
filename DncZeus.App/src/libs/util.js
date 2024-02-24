import Cookies from 'js-cookie'
// cookie儲存的天數
import config from '@/config'
import {
  forEach,
  hasOneOf,
  objEqual
} from '@/libs/tools'
const {
  title,
  cookieExpires,
  useI18n
} = config

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
}

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token
  else return ""
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通過路由列表得到菜單列表
 * @param {Array} pages 目前使用者可以訪問的頁面編碼列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access, pages) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access, pages)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) {
        if (pages && pages.indexOf(obj.name) > -1) {
          res.push(obj);
        }
      }
    }
  })
  return res
}

/**
 * @param {Array} routes 通過路由列表得到菜單列表
 * @returns {Array}
 */
export const getMenuListByRoutes = (routes) => {
  let res = []
  // res = [
  //   {
  //     icon: "md-contacts",
  //     name: "rbac",
  //     meta: {
  //       hideInMenu: false,
  //       title:"使用者許可權管理"
  //     },
  //     children: [
  //       {
  //         icon: "md-contacts",
  //         name: "rbac_user_page",
  //         meta: {
  //           hideInMenu: false,
  //           title:"使用者管理"
  //         }
  //       },
  //       {
  //         icon: "md-contacts",
  //         name: "rbac_role_page",
  //         meta: {
  //           hideInMenu: false,
  //           title:"許可權管理"
  //         }
  //       }
  //     ]
  //   }];
  // return res;
  forEach(routes, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways))) {
        obj.children = getMenuListByRoutes(item.children)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      res.push(obj);
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 目前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = {
    ...homeRoute,
    icon: homeRoute.meta.icon
  }
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hideInBread
  }).map(item => {
    let meta = {
      ...item.meta
    }
    if (meta.title && typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      meta.title = meta.title(route)
    }
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{
    ...homeItem,
    to: homeRoute.path
  }, ...res]
}

export const getRouteTitleHandled = (route) => {
  let router = {
    ...route
  }
  let meta = {
    ...route.meta
  }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let {
    title,
    __titleIsFunction__
  } = item.meta
  if (!title) return
  if (useI18n) {
    if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    else if (__titleIsFunction__) title = item.meta.title
    else title = vm.$t(item.name)
  } else title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @description 本地儲存和獲取標籤導航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每個元素只包含路由原資訊中的name, path, meta三項
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表陣列
 * @description 用於找到路由列表中name為home的對象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 現有標籤導航列表
 * @param {*} newRoute 新新增的路由原資訊對像
 * @description 如果該newRoute已經存在則不再新增
 */
export const getNewTagList = (list, newRoute) => {
  const {
    name,
    path,
    meta
  } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({
    name,
    path,
    meta
  })
  return newList
}

/**
 * @param {*} access 使用者許可權陣列，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 權鑒
 * @param {*} name 即將跳轉的路由name
 * @param {*} access 使用者許可權陣列
 * @param {*} routes 路由列表
 * @description 使用者是否可跳轉到該頁
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 從URL中解析參數
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 標籤列表
 * @param {String} name 目前關閉的標籤的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回撥函式需要執行的次數
 * @param {Function} callback 回撥函式
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 從上傳元件得到的檔案對像
 * @returns {Promise} resolve參數是解析后的二維陣列
 * @description 從Csv檔案中解析出表格，解析成二維陣列
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文字格式讀取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 讀到的數據
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上傳的不是Csv檔案'))
    }
  })
}

/**
 * @param {Array} array 表格數據二維陣列
 * @returns {Object} { columns, tableData }
 * @description 從二維陣列中獲取表頭和表格數據，將第一行作為表頭，用於在iView的表格中展示數據
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根據name/params/query判斷兩個路由對象是否相等
 * @param {*} route1 路由對像
 * @param {*} route2 路由對像
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判斷打開的標籤列表里是否已存在這個新新增的路由對像
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 * @description 根據目前跳轉的路由設定顯示在瀏覽器標籤的title
 * @param {Object} routeItem 路由對像
 * @param {Object} vm Vue實例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
}


export const getTagNavByRouteName = (routeName) => {
  let tagNavList = getTagNavListFromLocalstorage();
  let temp = tagNavList.filter((x) => x.name === routeName);
  let tagNav = (temp && temp.length > 0) ? temp[0] : null;
  return tagNav;
}
