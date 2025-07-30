<template>
  <div class="home-view py-5">
    <div class="container">
      <div class="row align-items-center min-vh-100">
        <div class="col-lg-6 text-center text-lg-start">
          <img 
            src="/placeholder-photo.svg" 
            alt="Peter Khoudary"
            class="img-fluid rounded-circle mb-4"
            style="max-width: 300px;"
          >
        </div>
        <div class="col-lg-6">
          <h1 class="display-4 fw-bold mb-4">Peter Khoudary</h1>
          <p class="lead mb-4">
            Welcome to my corner of the internet. I'm a [your profession/passion here].
          </p>
          <p class="mb-4">
            [Add your bio here - what you do, what you're interested in, what drives you]
          </p>
          <p>
            [Additional paragraph about your work, projects, or interests]
          </p>
          <div class="mt-4">
            <router-link to="/blog" class="btn btn-primary me-3">Read My Blog</router-link>
            <router-link to="/links" class="btn btn-outline-light">Find Me Online</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-view {
  min-height: calc(100vh - 80px); /* Accounting for navbar height */
  display: flex;
  align-items: center;
}

.btn-outline-light {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.btn-outline-light:hover {
  background-color: var(--text-primary);
  color: var(--forest-green);
}
</style>