import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'
import about from '../views/about.vue'
import carApp from '../views/car-app.vue'
import carDetails from '../views/car-details.vue'
import carEdit from '../views/car-edit.vue'
import activity from '../views/activity.vue'
// import carLogin from '../cmps/login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: carLogin
  // },
  {
    path: '/about',
    name: 'about',
    component: about
  },
  {
    path: '/car',
    name: 'carApp',
    component: carApp
  },
  {
    path: '/car/edit/:carId?',
    name: 'carEdit',
    component: carEdit
  },
  {
    path: '/car/details/:carId?',
    name: 'carDetails',
    component: carDetails
  },
  {
    path: '/activity/:userId',
    name: 'activity',
    component: activity
  }
]


const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
