import request from '@/utils/request'
import concans from '@/utils/concans'
export function login(data) {
  return request({
    url: 'http://'+concans.host+'/zenitoo-user/manage/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
