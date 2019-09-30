import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome }
      ] }
  ]
})

router.beforeEach((to, from, next) => {
  // 访问登录页，直接通过
  if (to.path === '/login') {
    return next()
  }
  // 获取token值
  const token = window.sessionStorage.getItem('token')
  // 没有token，没有登录，强制跳转到登录页
  if (!token) {
    return next('/login')
  }
  // 通过
  next()
})
export default router
