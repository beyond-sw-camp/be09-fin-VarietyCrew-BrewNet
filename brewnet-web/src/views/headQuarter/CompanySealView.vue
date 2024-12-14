<template>
  <div class="company-seal-container">
    <img v-if="sealImageUrl" :src="sealImageUrl" alt="법인인감 이미지" class="seal" />
    <EmptyContent v-else text="등록된 법인인감이 없습니다." fallback-label="등록하기" @fallback="goUpload" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import EmptyContent from '@/components/common/EmptyContent.vue';
import CompanyApi from '@/utils/api/CompanyApi';

const router = useRouter();

const sealImageUrl = ref('');

const companyApi = new CompanyApi();

const getCompanySeal = () => {
  companyApi.getCompanySeal().then(data => {
    if (!data) return;

    sealImageUrl.value = data.imageUrl;
  });
};

const goUpload = () => {
  router.push({ name: 'hq:settings:company-seal:upload' });
};

onMounted(() => {
  getCompanySeal();
});
</script>

<style scoped>
.company-seal-container {
  img.seal {
    width: 250px;
    height: 250px;
  }
}
</style>
