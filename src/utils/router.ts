import { createMemoryHistory, createRouter } from 'vue-router'

import Home from '@/views/Home.vue'
import Writing from '@/views/Writing.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/writing', component: Writing }
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})