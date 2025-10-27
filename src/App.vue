<template>
  <div class="contentWrapper">
    <div class="mainContent">
      <div class="headerContent">
        <RouterLink to="/" class="navTab">Peter Khoudary</RouterLink>
        <div class="sideLinks">
          <RouterLink to="/writing" class="navTab">Writing</RouterLink>
          <a href="https://www.youtube.com/@peterkhoudary" target="_blank" class="navTab">YT</a>
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

.contentWrapper {
  display: flex;
  justify-content: center;
}

.mainContent {
  display: flex;
  flex-direction: column;
  width: clamp(300px, 65%, 12000px);
  padding: 0 1rem;
}

.headerContent {
  display: flex;
  justify-content: space-between;
  font-family: 'Playfair Display', 'Times New Roman';
  position: sticky;
  top: 0;
  background-color: antiquewhite;
  padding: clamp(0.5rem, 1vw, 1rem) 0;
}

.navTab {
  font-size: clamp(1.25rem, 4vw, 2.5rem);
  font-weight: 600;
}

.sideLinks {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: clamp(1rem, 4vw, 2.5rem);
}
</style>
