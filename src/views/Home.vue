<template>
  <div class="imgWrapper">
    <img src="/assets/mountains.jpg" class="mainImage" />
  </div>
  <RouterView />
</template>

<script setup lang="ts" />

<style scoped>
.imgWrapper {
  display: flex;
  justify-content: center;
}

.mainImage {
  border: 4px solid black;
}
</style>
