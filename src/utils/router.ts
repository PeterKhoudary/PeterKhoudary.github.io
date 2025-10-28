import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Writing from '@/views/Writing.vue'
import BlogPost from '@/views/BlogPost.vue'

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: 'writing',
        component: Writing,
        children: [{ path: ':slug', component: BlogPost }],
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
