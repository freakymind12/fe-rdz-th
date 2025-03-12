<template>
  <a-row :gutter="[16, 16]" :wrap="true">
    <MasterDevice />
    <a-col :lg="12">
      <a-row :gutter="[16, 16]" :wrap="true">
        <MasterGroup />
        <MasterPic />
      </a-row>
    </a-col>
  </a-row>
</template>

<script setup>
import MasterGroup from './component/MasterGroup.vue'
import MasterDevice from './component/MasterDevice.vue'
import MasterPic from './component/MasterPic.vue'
</script>
