<template>
  <a-config-provider :theme="theme">
    <RouterView />
  </a-config-provider>
</template>

<script setup>
const theme = {
  token: {
    fontFamily: 'Nunito, Arial',
    colorPrimary: '#1F5781',
  },
}
</script>

<style scoped></style>
