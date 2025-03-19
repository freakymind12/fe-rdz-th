<template>
  <div>
    <iframe :src="embedURL" class="embed"></iframe>
  </div>
</template>

<script setup>
const embedURL = import.meta.env.VITE_HEATMAP_DASHBOARD_URL
</script>

<style scoped>
.embed {
  height: 90vh;
  width: 100%;
  border: none;
}
</style>
