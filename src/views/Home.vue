<template>
  <div class="imgWrapper">
    <img src="../../assets/mountains.jpg" class="mainImage" />
  </div>
</template>

<script setup lang="ts" />

<style scoped>
.imgWrapper {
  display: flex;
  justify-content: center;
}

.mainImage {
  border-style: solid;
  border-width: 4px;
  border-color: black;
}

img {
  width: 100%;
  height: auto;
}
</style>
