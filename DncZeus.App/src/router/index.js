import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";
import store from "@/store";
import iView from "iview";
import {
  setToken,
  getToken,
  canTurnTo,
  setTitle
} from "@/libs/util";
import {
  getUnion
} from '@/libs/tools'
import staticRouters from '@/router/static-routers'
import axios from '@/libs/api.request'
import config from "@/config";
// 引入載入菜單
import { formatMenu } from '@/libs/router-util'

const {
  homeName
} = config;
const baseUrl =
  process.env.NODE_ENV === "development" ?
    config.baseUrl.dev :
    config.baseUrl.pro;

Vue.use(Router);
const router = new Router({
  routes: [...routes],
  mode: "hash"
});
const LOGIN_PAGE_NAME = "login";

const initRouter = () => {
  let list = []
  axios.request({
    url: 'account/menu',
    method: 'get'
  }).then(res => {
    var menuData = res.data;
    // 格式化菜單
    list = formatMenu(menuData)
    // 重新整理界面菜單
    store.dispatch('refreshMenuList', list)

  });

  return list
}

const turnTo = (to, checkPermission, permissions, next) => {
  // if (canTurnTo(to.name, access, routes)) next();
  // // 有許可權，可訪問
  // else
  //   next({
  //     replace: true,
  //     name: "error_401"
  //   }); // 無許可權，重定向到401頁面

  // 有許可權，可訪問
  to.meta.checkPermission = checkPermission;
  permissions = permissions || [];
  if (permissions && permissions[to.name]) {
    to.meta.permissions = permissions[to.name];
  }
  next();
};

router.beforeEach((to, from, next) => {
  if (!to.matched || to.matched.length <= 0) {
    if (store.state.user.hasGetInfo) {
      store.dispatch("closeTag", to.name);
      next({ path: "/404", replace: true });
    }
  }

  iView.LoadingBar.start();
  const token = getToken();
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登錄且要跳轉的頁面不是登錄頁
    next({
      name: LOGIN_PAGE_NAME // 跳轉到登錄頁
    });
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陸且要跳轉的頁面是登錄頁
    next(); // 跳轉
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登錄且要跳轉的頁面是登錄頁
    next({
      name: homeName // 跳轉到homeName頁
    });
  } else {
    let checkPermission = true;
    if (store.state.user.hasGetInfo) {
      checkPermission = store.state.user.user_type != 0;
      next()
      turnTo(to, checkPermission, store.state.user.permissions, next)
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取使用者資訊，通過使用者許可權和跳轉的頁面的name來判斷是否有許可權訪問;access必須是一個陣列，如：['super_admin']
        checkPermission = user.user_type != 0;
        initRouter();
        //next()
        turnTo(to, checkPermission, user.permissions, next)
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
});

router.afterEach(to => {
  setTitle(to, router.app);
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;

const createRouter = () => new Router({
  mode: 'hash',
  routes: [...routes]
})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
