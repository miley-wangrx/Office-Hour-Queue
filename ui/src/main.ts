import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import CustomerScreen from '@/views/StudentScreen.vue'
import OperatorScreen from '@/views/StaffScreen.vue'
import SignupScreen from '@/views/SignupScreen.vue'
import RedirectScreen from '@/views/RedirectScreen.vue'

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/signup",
      component: SignupScreen,
    },
    {
      path: "/redirect",
      component: RedirectScreen,
    },
    {
      path: "/student/:studentId",
      component: CustomerScreen,
      props: ({ params: { studentId }}) => ({ studentId }),
    },
    {
      path: "/staff/:staffId",
      component: OperatorScreen,
      props: ({ params: { staffId }}) => ({ staffId }),
    },
  ],
})

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
