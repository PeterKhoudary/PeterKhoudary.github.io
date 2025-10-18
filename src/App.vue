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
  width: 60vw;
}

.headerContent {
  display: flex;
  justify-content: space-between;
  font-family: 'Playfair Display', 'Times New Roman';
  position: sticky;
  top: 0;
  background-color: antiquewhite;
  padding: min(1vh, 1vw) 0rem;
}

.navTab {
  font-size: min(4vh, 4vw);
  font-weight: 600;
}

.sideLinks {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: min(4vh, 4vw);
}
</style>
