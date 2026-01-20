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
  width: 100%;
  max-width: 1000px;
  padding: 0 1rem;
}

.headerContent {
  display: flex;
  justify-content: space-between;
  top: 0;
  background-color: antiquewhite;
  padding: 1rem 0;
}

.navTab {
  font-size: 2rem;
  font-weight: 600;
}

.sideLinks {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
}

@media (max-width: 600px) {
  .navTab {
    font-size: 1.25rem;
  }
  .sideLinks {
    gap: 1rem;
  }
}
</style>
