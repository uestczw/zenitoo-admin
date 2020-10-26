import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUser(user) {
  return Cookies.set('zenitoo-user',user)
}
export function getUser() {
  return Cookies.get('zenitoo-user')
}
export function removeUser() {
  return Cookies.remove('zenitoo-user')
}
export function setEmp(emp) {
  Cookies.set('zenitoo-emp-id',emp.employee_id)
  Cookies.set('zenitoo-emp-type',emp.alliance_sys_type)
  return Cookies.set('zenitoo-emp',emp)
}
export function getEmp() {
  return Cookies.get('zenitoo-emp-id')
}
export function getEmpType() {
  return Cookies.get('zenitoo-emp-type')
}
export function removeEmp() {
  Cookies.remove('zenitoo-emp-id')
  Cookies.remove('zenitoo-emp-type')
  return Cookies.remove('zenitoo-emp')
}