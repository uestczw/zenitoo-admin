import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getUser, getEmp, getEmpType } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import {constantRoutes} from '@/router'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
const rules = { 'admin': {
  '/sysdata': true,
  '/sysdata/cell': true,
  '/sysdata/carport': true,
  '/sysdata/chargepost': true,
  '/sysdata/cartype': true,
  '/sysdata/syscard': true,
  '/sysdata/contract': true,
  '/sysdata/deviceLog': true,
  '/money': true,
  '/money/payorder': true,
  '/money/refund': true,
  '/money/banlance': true,
  '/money/settle': true,
  '/money/checkSettle': true,
  '/user': true,
  '/user/merchant': true,
  '/user/cards': true,
  '/user/user': true,
  '/user/memberUser': true,
  '/center': true,
  '/center/money': true,
  '/center/takeout': true,
  '/order': true,
  '/order/ic': true,
  '/order/trace': true,
  '/order/package': true,
  '/order/userInout': true,
  '/order/chargeOrder': true,
  '/order/chargeHisOrder': true,
  '/order/allpay': true,
  '/setting': true,
  '/setting/payinfo': true,
},
'superadmin': {

}
}

router.beforeEach(async(to, from, next) => {
  rules.sys_admin = rules.admin;
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  const emp = getEmp()
  const emptype = getEmpType()
  if (hasToken && emp) {
    var user = getUser()
    console.log(user)
    console.log('emptype---------------------------')
    console.log(emptype)
    constantRoutes.forEach(item => {
      if(item.needpower && rules[emptype] && rules[emptype][item.path]) {
        //console.log(item.path+'------------');
        item.hidden = false
        if(item.children) {
          item.children.forEach(citem => {
            if(citem.needpower && rules[emptype] && rules[emptype][item.path + '/' + citem.path]) {
              //console.log(item.path + '/' + citem.path+'------------');
              citem.hidden = false
            }
          })
        }
      }
    })
    console.log(constantRoutes)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
