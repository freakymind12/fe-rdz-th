<template>
  <a-table
    :columns="columns"
    :data-source="data"
    bordered
    :pagination="false"
    :scroll="{ x: scrollX, y: scrollY }"
    :size="size"
  >
    <template #bodyCell="{ column, record }">
      <slot name="bodyCell" :column="column" :record="record" />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </a-table>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  size: {
    type: String,
    default: 'small',
  },
  scrollX: {
    type: Number,
    default: 200,
  },
  scrollY: {
    type: Number,
    default: 400,
  },
})
</script>
