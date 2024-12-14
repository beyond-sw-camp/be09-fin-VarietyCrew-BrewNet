<template>
  <label class="app-label" :for="labelFor">{{ label }}</label>
</template>

<script setup>
const { labelFor, label } = defineProps({
  label: {
    type: String,
    required: true,
  },

  labelFor: {
    type: String,
    required: false,
    default: undefined,
  },
});
</script>

<style scoped>
label.app-label {
  font-size: 14px;
  color: var(--p-surface-600);
}
</style>
