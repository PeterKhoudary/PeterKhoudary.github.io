<template>
  <div class="home-view">
    <div class="container h-100 d-flex align-items-center">
      <div class="row align-items-center w-100">
        <div class="col-lg-5 d-flex flex-column align-items-center gap-3">
          <img 
            src="/public/me.jpg" 
            alt="Peter Khoudary"
            class="img-fluid rounded-circle profile-image-main"
          >
        </div>
        <div class="col-lg-7">
          <h1 class="display-4 fw-bold mb-4">Peter Khoudary</h1>
          <p class="lead mb-4" style="font-size: 1.4rem; line-height: 1.8;">
            Welcome to my corner of the internet. I'm a [your profession/passion here].
          </p>
          <p class="mb-4">
            [Add your bio here - what you do, what you're interested in, what drives you]
          </p>
          <p>
            [Additional paragraph about your work, projects, or interests]
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-view {
  height: calc(100vh - 66px); /* Exact height minus smaller navbar */
  overflow: hidden;
}

/* Remove default Bootstrap margins that might cause overflow */
.home-view .container {
  padding-top: 0;
  padding-bottom: 0;
}

.home-view .row {
  margin: 0;
}

.btn-outline-light {
  border-color: var(--accent-green);
  color: var(--accent-green);
  font-weight: 600;
}

.btn-outline-light:hover {
  background-color: var(--accent-green);
  color: var(--forest-green);
  border-color: var(--accent-green);
}

/* Main profile image */
.profile-image-main {
  width: 100%;
  max-width: 280px;
  height: auto;
}

/* Smaller images */
.profile-image-small {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

/* Responsive sizing */
@media (max-width: 768px) {
  .profile-image-main {
    max-width: 200px;
  }
  
  .profile-image-small {
    width: 80px;
    height: 80px;
  }
}

@media (min-width: 1200px) {
  .profile-image-main {
    max-width: 320px;
  }
  
  .profile-image-small {
    width: 140px;
    height: 140px;
  }
}
</style>