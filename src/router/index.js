import Vue from 'vue'
import Router from 'vue-router'
import ServiceIndex from '@/components/ServiceIndex'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
          initial_interfaces: [ "WUI" ]
      }
    },
    {
      path: '/webservices',
      name: 'ServiceIndexWebservice',
      component: ServiceIndex,
      props: {
          showtoolbar: false,
          showdescription: false,
          initial_filters: [],
          initial_interfaces: [ "REST" ]
      }
    },
    {
      path: '/cli',
      name: 'ServiceIndexCLI',
      component: ServiceIndex,
      props: {
          showtoolbar: false,
          showdescription: false,
          initial_filters: [],
          initial_interfaces: [ "CLI" ]
      }
    },
    {
      path: '/lib',
      name: 'ServiceIndexLIB',
      component: ServiceIndex,
      props: {
          showtoolbar: false,
          showdescription: false,
          initial_filters: [],
          initial_interfaces: [ "LIB" ]
      }
    }
  ]
})
