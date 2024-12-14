<template>
  <div class="company-seal-upload-container">
    <Button size="small" label="파일 선택" variant="outlined" severity="secondary" @click="clickChoose" />
    <input ref="inputRef" type="file" accept="image/*" style="display: none" @change="changeFile" />

    <div v-if="previewUrl" class="uploaded-area">
      <img v-if="previewUrl" :src="previewUrl" alt="업로드 된 이미지" />
      <Button size="small" label="저장" @click="clickSave" />
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'primevue';
import { onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAppConfirmModal } from '@/hooks/useAppConfirmModal';
import MasterCompanyApi from '@/utils/api/MasterCompanyApi';

const router = useRouter();
const toast = useToast();
const { showConfirm } = useAppConfirmModal();

const previewUrl = ref(null);
const imageFile = ref(null);
const inputRef = ref(null);

const masterCompanyApi = new MasterCompanyApi();

const clickChoose = () => {
  inputRef.value?.click();
};

const changeFile = event => {
  const { files } = event.target;
  if (files.length > 0) {
    const file = files[0];

    URL.revokeObjectURL(previewUrl); // 기존 파일 지우고

    // 새로운 파일로 교체
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const saveImage = () => {
  masterCompanyApi.editCompanySeal(imageFile.value).then(() => {
    toast.add({ severity: 'success', summary: '처리 성공', detail: '법인인감이 수정되었습니다.', life: 3000 });
    router.replace({ name: 'hq:settings:company-seal' });
  });
};

const clickSave = () => {
  showConfirm({
    header: '법인인감 변경',
    message: '법인인감 이미지를 변경할까요?',
    acceptLabel: '변경',
    danger: true,
    onAccept: saveImage,
  });
};

onUnmounted(() => {
  // 남아있는 리소스 정리
  URL.revokeObjectURL(previewUrl);
});
</script>

<style scoped>
.company-seal-upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .uploaded-area {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    img {
      width: 250px;
      height: 250px;
      object-fit: contain;
    }
  }
}
</style>
