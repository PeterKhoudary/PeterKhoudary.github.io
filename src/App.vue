<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid px-5">
        <router-link to="/" class="navbar-brand fw-bold">Peter Khoudary</router-link>
        
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto gap-3">
            <li class="nav-item">
              <router-link to="/" class="nav-link" :class="{ active: $route.name === 'home' }">
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/blog" class="nav-link" :class="{ active: $route.name === 'blog' }">
                Blog
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/links" class="nav-link" :class="{ active: $route.name === 'links' }">
                Links
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* Global styles are in style.css */
</style>