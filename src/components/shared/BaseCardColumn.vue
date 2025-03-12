<template>
  <a-col
    :xs="{ span: xs }"
    :lg="{ span: lg }"
    :xl="{ span: xl }"
    :md="{ span: md }"
    :sm="{ span: sm }"
  >
    <a-card :class="{ bordered: bordered }" :size="size" :hoverable="hoverable">
      <template #title>
        <span v-if="title" class="header-big-font">{{ title }}</span>
      </template>
      <template #extra>
        <slot name="extra" />
      </template>
      <slot name="body" />
    </a-card>
  </a-col>
</template>

<script setup>
defineProps({
  xs: Number,
  sm: Number,
  md: Number,
  lg: Number,
  xl: Number,
  title: String,
  size: {
    type: String,
    default: 'default',
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  backgroundColor: {
    type: String,
    default: 'white',
  },
})
</script>

<style scoped>
.header-big-font {
  font-weight: bold;
  font-size: x-large;
}

.bordered {
  border: 2px solid rgb(166, 174, 191);
}
</style>
