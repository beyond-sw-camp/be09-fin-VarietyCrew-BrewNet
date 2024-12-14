<template>
  <RouterView />

  <AppConfirmModal />
  <Toast position="top-center" />
  <BigImageModal />
</template>

<script setup>
import { useToast } from 'primevue';
import { onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';

import AppConfirmModal from './components/common/AppConfirmModal.vue';
import BigImageModal from './components/common/BigImageModal.vue';
import DOMEvent from './utils/domEvent';

const toast = useToast();

function handleApiError(customEvent) {
  toast.add({ severity: 'error', summary: '에러', detail: customEvent.detail, life: 3000 });
}

function handleApiSuccess(customEvent) {
  toast.add({ severity: 'success', summary: '처리 성공', detail: customEvent.detail, life: 3000 });
}

onMounted(() => {
  DOMEvent.subscribeApiError(handleApiError);
  DOMEvent.subscribeApiSuccess(handleApiSuccess);
  // DOMEvent.subscribeExpiredToken(handleExpiredToken);
});

onUnmounted(() => {
  DOMEvent.unsubscribeApiError(handleApiError);
  DOMEvent.unsubscribeApiSuccess(handleApiSuccess);
  // DOMEvent.unsubscribeExpiredToken(handleExpiredToken);
});
</script>

<style scoped></style>
