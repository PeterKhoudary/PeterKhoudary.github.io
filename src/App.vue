<script setup lang="ts"></script>

<template>
  <div class="contentWrapper">
    <div class="mainContent">
      <div class="headerContent">
        <h1>Peter Khoudary</h1>
        <div class="links">
          <h1><a href="https://www.youtube.com/@peterkhoudary" target="_blank">YT</a></h1>
          <h1><a href="https://www.instagram.com/peterkhoudary/" target="_blank">IG</a></h1>
        </div>
      </div>
      <img src="../assets/mountains.jpg" class="mainImage" />
    </div>
  </div>
</template>

<style scoped>
.contentWrapper {
  display: flex;
  justify-content: center;
}
.mainContent {
  margin: 10rem;
  display: flex;
  flex-direction: column;
  width: min(60%, 1200px);
}

.headerContent {
  display: flex;
  justify-content: space-between;
}

.links {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
}

.mainImage {
  border-style: solid;
  border-width: 4px;
  border-color: black;
  width: 100%;
}

a {
  text-decoration: none;
  color: black;
  transition: color 0.2s ease-in-out;
}

a:hover {
  color: orangered;
}

img {
  max-width: 100%;
  height: auto;
}
</style>
