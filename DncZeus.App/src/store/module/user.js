import {
  login,
  logout,
  getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user'
import {
  setToken,
  getToken,
  setTagNavListInLocalstorage
} from '@/libs/util'
import {
  getUnion
} from '@/libs/tools'
import staticRouters from '@/router/static-routers'

export default {
  state: {
    userName: '',
    userGuid: '',
    user_type: -1,
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {},
    permissions: {},
    profile: {}
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserGuid(state, guid) {
      state.userGuid = guid
    },
    setUserType(state, type) {
      state.user_type = type
    },
    setUserName(state, name) {
      state.userName = name
    },
    setAccess(state, access) {
      state.access = access
    },
    //設定使用者可以訪問的頁面編碼列表
    setPages(state, pages) {
      //state.pages = pages;
    },
    //設定使用者可以訪問頁面的許可權集合
    setPermissions(state, permissions) {
      state.permissions = permissions;
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    setMessageCount(state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList(state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList(state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList(state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore(state, {
      msg_id,
      content
    }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg(state, {
      from,
      to,
      msg_id
    }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登錄
    handleLogin({
      commit
    }, {
      userName,
      password
    }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res.data
          if (data.code === 200 && data && data.data) {
            commit('setToken', data.data)
          } else {

          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登錄
    handleLogOut({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        // 如果登錄需要請求介面，則使用如下(1)的ajax請求，否則使用(2)的本地退出方式
        // 1.遠端介面退出登錄方式
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   commit('setPages', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })

        // 2.本地退出登錄方式
        // 如果你的退出登錄無需請求介面，則可以直接使用下面三行程式碼而無需使用logout呼叫介面
        commit('setToken', '')
        commit('setAccess', [])
        //commit('setPages', [])
        commit('setPermissions', {})
        setTagNavListInLocalstorage([]);
        resolve()
        //location.reload();
      })
    },
    // 獲取使用者相關資訊
    getUserInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data.data
            commit('setAvator', data.avator)
            commit('setUserName', data.user_name)
            commit('setUserGuid', data.user_guid)
            commit('setAccess', data.access)
            //commit('setPages', getUnion(data.pages, staticRouters))
            commit('setPermissions', data.permissions)
            commit("setUserType", data.user_type);
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用來獲取未讀訊息條數，介面只返回數值，不返回訊息列表
    getUnreadMessageCount({
      state,
      commit
    }) {
      getUnreadCount().then(res => {
        const {
          data
        } = res
        commit('setMessageCount', data)
      })
    },
    // 獲取訊息列表，其中包含未讀、已讀、回收站三個列表
    getMessageList({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          const {
            unread,
            readed,
            trash
          } = res.data.data
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根據目前點選的訊息的id獲取內容
    getContentByMsgId({
      state,
      commit
    }, {
      msg_id
    }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            const content = res.data.data
            commit('updateMessageContentStore', {
              msg_id,
              content
            })
            resolve(content)
          })
        }
      })
    },
    // 把一個未讀訊息標記為已讀
    hasRead({
      state,
      commit
    }, {
      msg_id
    }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 刪除一個已讀訊息到回收站
    removeReaded({
      commit
    }, {
      msg_id
    }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 還原一個已刪除訊息到已讀訊息
    restoreTrash({
      commit
    }, {
      msg_id
    }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
