<template>
  <div class="app-label-text-container">
    <AppLabel :label="label" />
    <p>{{ text }}</p>
  </div>
</template>

<script setup>
import AppLabel from './AppLabel.vue';

const { label, text } = defineProps({
  label: {
    type: String,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.app-label-text-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
