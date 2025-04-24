<template>
  <div>
    <span class="bold x-large">Heatmap RDZ Device</span>
    <iframe :src="embedURL" class="embed"></iframe>
  </div>
</template>

<script setup>
const embedURL = import.meta.env.VITE_HEATMAP_DASHBOARD_URL
</script>

<style scoped>
.embed {
  height: 82vh;
  width: 100%;
  border: none;
  border-radius: 10px;
}
</style>
