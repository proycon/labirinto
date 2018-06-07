import Vue from 'vue'
import Router from 'vue-router'
import ServiceIndex from '@/components/ServiceIndex'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ServiceIndex',
      component: ServiceIndex,
      props: {
          showtoolbar: true,
          showdescription: true,
          initial_filters: [ "thirdparty", "remote" ],
          initial_interfaces: [ "WUI", "REST" ]
      }
    },
    {
      path: '/web',
      name: 'ServiceIndexWeb',
      component: ServiceIndex,
      props: {
          showtoolbar: false,
          showdescription: false,
          initial_filters: [],
          initial_interfaces: [ "WUI" ],
          hideheader: true,
          hidefooter: true
      }
    }
  ]
})
