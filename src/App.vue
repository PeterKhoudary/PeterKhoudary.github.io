<template>
  <div class="contentWrapper">
    <div class="mainContent">
      <div class="headerContent">
        <RouterLink to="/" class="navTab">Peter Khoudary</RouterLink>
        <div class="sideLinks">
          <RouterLink to="/writing" class="navTab">Writing</RouterLink>
          <!-- <a href="https://www.youtube.com/@peterkhoudary" target="_blank" class="navTab">YT</a> -->
        </div>
      </div>
      <div>
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.contentWrapper {
  display: flex;
  justify-content: center;
}

.mainContent {
  display: flex;
  flex-direction: column;
  width: clamp(300px, 70%, 12000px);
  padding: 0 1rem;
}

.headerContent {
  display: flex;
  justify-content: space-between;
  top: 0;
  background-color: antiquewhite;
  padding: clamp(0.5rem, 1vw, 1rem) 0;
}

.navTab {
  font-size: 2rem;
  font-weight: 600;
}

@media (max-width: 600px) {
  .navTab {
    font-size: 1.25rem;
  }
}

.sideLinks {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: clamp(1rem, 4vw, 2.5rem);
}
</style>
