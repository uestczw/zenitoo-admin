import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/sysdata',
    component: Layout,
    needpower: true,
    hidden: true,
    //redirect: '/cell/list', //重定向地址，在面包屑中点击会重定向去的地址
    name: '基础数据管理',
    meta: { title: '基础数据管理', icon: 'el-icon-s-help' },
    children: [
      {
        needpower: true,
        hidden: true,
        path: 'cell',
        name: '小区管理',
        component: () => import('@/views/cell/list/index'),
        meta: { title: '小区管理', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'carport',
        name: '车棚管理',
        component: () => import('@/views/carport/list/index'),
        meta: { title: '车棚管理', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'chargepost',
        name: '充电桩管理',
        component: () => import('@/views/chargepost/list/index'),
        meta: { title: '充电桩管理', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'cartype',
        name: '车辆类型管理',
        component: () => import('@/views/cartype/list/index'),
        meta: { title: '车辆类型管理', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'carportdoor',
        name: '门禁管理',
        component: () => import('@/views/carportdoor/list/index'),
        meta: { title: '门禁管理', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'syscard',
        name: '系统卡片管理',
        component: () => import('@/views/syscard/list/index'),
        meta: { title: '系统卡片管理', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'contract',
        name: '合同管理',
        component: () => import('@/views/contract/list/index'),
        meta: { title: '合同管理', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'deviceLog',
        name: '设备日志管理',
        component: () => import('@/views/deviceLog/list/index'),
        meta: { title: '设备日志管理', icon: 'table' }
      }
    ]

  },
  {
    needpower: true,
    hidden: true,
    path: '/money',
    component: Layout,
    name: '资金管理',
    meta: { title: '资金管理', icon: 'link' },
    children: [
      {
        needpower: true,
        hidden: true,
        path: 'payorder',
        name: '补单管理',
        component: () => import('@/views/payorder/list/index'),
        meta: { title: '补单管理', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'refund',
        name: '用户退款管理',
        component: () => import('@/views/refund/list/index'),
        meta: { title: '用户退款管理', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'banlance',
        name: '日统计列表',
        component: () => import('@/views/banlance/index'),
        meta: { title: '日统计列表', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'settle',
        name: '结算管理',
        component: () => import('@/views/settle/index'),
        meta: { title: '结算管理', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'checkSettle',
        name: '结算审核',
        component: () => import('@/views/checkSettle/index'),
        meta: { title: '结算审核', icon: 'table' }
      }
    ]
  },
  {
    needpower: true,
    hidden: true,
    path: '/user',
    component: Layout,
    name: '用户管理',
    meta: { title: '用户管理', icon: 'nested' },
    children: [
      {
        needpower: true,
        hidden: true,
        path: 'merchant',
        name: '商户管理',
        component: () => import('@/views/merchant/list/index'),
        meta: { title: '商户管理', icon: 'nested' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'cards',
        name: '用户卡片管理',
        component: () => import('@/views/cards/list/index'),
        meta: { title: '用户卡片管理', icon: 'nested' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'user',
        name: '员工账户管理',
        component: () => import('@/views/user/list/index'),
        meta: { title: '员工账户管理', icon: 'table' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'memberUser',
        name: '会员用户',
        component: () => import('@/views/memberUser/index'),
        meta: { title: '会员用户', icon: 'table' }
      }
    ]
  },
  {
    needpower: true,
    hidden: true,
    path: '/center',
    component: Layout,
    name: '个人中心',
    meta: { title: '个人中心', icon: 'nested' },
    children: [
      {
        needpower: true,
        hidden: true,
        path: 'money',
        name: '我的收支',
        component: () => import('@/views/centerMoney/list/index'),
        meta: { title: '我的收支', icon: 'nested' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'takeout',
        name: '提现记录',
        component: () => import('@/views/takeout/index'),
        meta: { title: '提现记录', icon: 'nested' }
      }
    ]
  },
  {
    needpower: true,
    hidden: true,
    path: '/order',
    component: Layout,
    name: '订单中心',
    meta: { title: '订单中心', icon: 'nested' },
    children: [
      {
        needpower: true,
        hidden: true,
        path: 'ic',
        name: 'ic卡购买订单',
        component: () => import('@/views/icOrder/index'),
        meta: { title: 'ic卡购买订单', icon: 'nested' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'trace',
        name: '押金支付订单',
        component: () => import('@/views/traceOrder/index'),
        meta: { title: '押金支付订单', icon: 'nested' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'package',
        name: '用户停车包',
        component: () => import('@/views/userPackage/index'),
        meta: { title: '用户停车包', icon: 'nested' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'userInout',
        name: '用户进出门记录',
        component: () => import('@/views/userInout/index'),
        meta: { title: '用户进出门记录', icon: 'nested' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'chargeOrder',
        name: '充电中订单',
        component: () => import('@/views/chargeOrder/index'),
        meta: { title: '充电中订单', icon: 'nested' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'chargeHisOrder',
        name: '充电历史订单',
        component: () => import('@/views/chargeHisOrder/index'),
        meta: { title: '充电历史订单', icon: 'nested' }
      },
      {
        needpower: true,
        hidden: true,
        path: 'allpay',
        name: '总支付订单',
        component: () => import('@/views/allpay/index'),
        meta: { title: '总支付订单', icon: 'nested' }
      }
    ]
  },
  {
    needpower: true,
    hidden: true,
    path: '/setting',
    component: Layout,
    name: '配置管理',
    meta: { title: '配置管理', icon: 'nested' },
    children: [
      {
        needpower: true,
        hidden: true,
        path: 'payinfo',
        name: '支付信息配置',
        component: () => import('@/views/payinfo/index'),
        meta: { title: '支付信息配置', icon: 'nested' }
      },
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
