<template>
  <Tabs :value="modelValue" class="app-tabs" @update:value="onUpdate">
    <TabList
      :pt="{
        tabList: {
          style: {
            'border-bottom': '2px solid var(--p-surface-100)',
            gap: '5px',
            'padding-left': '10px',
          },
        },
      }"
    >
      <Tab v-for="tabItem in tabItems" :key="tabItem.value" :value="tabItem.value">{{ tabItem.label }}</Tab>
    </TabList>
  </Tabs>
</template>

<script setup>
const { tabItems, modelValue } = defineProps({
  tabItems: {
    type: Array, // [{ label: string, value: string }]
    required: true,
  },

  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const onUpdate = value => {
  emit('update:modelValue', value);
};
</script>

<style scoped>
.app-tabs {
  .p-tab {
    border: 1px solid var(--p-surface-100);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: var(--p-surface-50);
    transition: all 0.1s;
    border-bottom: 2px solid var(--p-surface-100);
    top: 2px;
  }

  .p-tab.p-tab-active {
    background-color: white;
    color: var(--p-primary-700);
    border-bottom-color: white;
  }
}
</style>
