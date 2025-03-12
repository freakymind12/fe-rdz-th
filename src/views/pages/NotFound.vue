<template>
  <a-flex justify="center" align="center" vertical class="not-found">
    <a-result status="404">
      <template #title>
        <span class="xx-large">404</span>
      </template>
      <template #subTitle>
        <a-flex vertical>
          <span class="large"
            >We searched the entire server, but this page is missing. Want to teleport back to the
            homepage?</span
          >
        </a-flex>
      </template>
      <template #extra>
        <a-button type="primary" @click="router.push('/')" size="large">Back Home</a-button>
      </template>
    </a-result>
  </a-flex>
</template>

<script setup>
import router from '@/router'
</script>

<style scoped>
.not-found {
  height: 85vh;
}

.large {
  font-size: large;
}

.xx-large {
  font-size: xx-large;
}
</style>
