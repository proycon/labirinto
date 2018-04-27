import Vue from 'vue'
import Router from 'vue-router'
import ServiceIndex from '@/components/ServiceIndex'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ServiceIndex',
      component: ServiceIndex
    }
  ]
})
