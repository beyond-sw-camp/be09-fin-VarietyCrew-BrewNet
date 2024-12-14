<template>
  <div>
    반품요청 목록

    <Button label="상세보기(디자인 마음대로 수정해주세요!!)" @click="goToDetail" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToDetail = () => {
  router.push({ name: 'hq:order:return:detail', params: { returnCode: 'dddd' } });
};
</script>

<style scoped></style>
