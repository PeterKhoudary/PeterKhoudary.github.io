import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Writing from '@/views/Writing.vue'
import BlogPost from '@/views/BlogPost.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/writing', component: Writing },
  { path: '/writing/:slug', component: BlogPost },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
