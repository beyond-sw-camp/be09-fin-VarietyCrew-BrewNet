<template>
  <div class="app-check-container">
    <template v-if="!name">
      <!-- 싱글 체크박스 -->
      <Checkbox :checked="modelValue" :input-id="id" :name="name" binary size="small" @change="onChangeCheck" />
      <AppLabel v-if="label" :label-for="id" :label="label" />
    </template>
    <template v-else>
      <!-- 체크박스 여러개 -->
    </template>
  </div>
</template>

<script setup>
import AppLabel from '../AppLabel.vue';

const { label, name, modelValue, id } = defineProps({
  // v-model로 넘겨주면 알아서 셋팅되는 값
  modelValue: {
    type: Boolean,
    required: true,
  },

  //
  // required: false
  //
  // 체크박스 여러개 사용할 경우 셋팅 필요
  name: {
    type: String,
    required: false,
    default: undefined,
  },

  id: {
    type: String,
    required: false,
    default: undefined,
  },

  label: {
    type: String,
    required: false,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const onChangeCheck = event => {
  emit('update:modelValue', event.target.checked);
};
</script>

<style scoped>
.app-check-container {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
