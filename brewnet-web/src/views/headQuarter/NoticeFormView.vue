<template>
  <form class="notice-form-container" @submit.prevent="onSubmit">
    <AppInputText v-model="title" label="제목" />
    <Textarea v-model="content" rows="17" fluid placeholder="내용을 입력해주세요" size="small" />

    <div class="upload-image-area">
      <button type="button" class="upload-button" @click="clickChoose">
        <i class="pi pi-images"></i>
        <p>사진 선택</p>
      </button>
      <input ref="inputRef" type="file" accept="image/*" multiple style="display: none" @change="changeFile" />

      <ul v-if="noticeImagesFiles.length > 0" class="upload-image-list">
        <li
          v-for="(uploadImage, i) in noticeImagesFiles"
          :key="uploadImage.preview"
          :style="{ backgroundImage: `url(${uploadImage.preview})` }"
          class="upload-image-item"
        >
          <Button
            icon="pi pi-times"
            size="small"
            rounded
            severity="secondary"
            class="remove-button"
            @click="clickRemoveImage(i)"
          />
        </li>
      </ul>
    </div>

    <Button type="submit" label="저장" />
  </form>
</template>

<script setup>
import { useToast } from 'primevue';
import { onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppInputText from '@/components/common/form/AppInputText.vue';
import HQNoticeApi from '@/utils/api/HQNoticeApi';
import MasterNoticeApi from '@/utils/api/MasterNoticeApi';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const { noticeCode } = route.params;

const title = ref('');
const content = ref('');
const inputRef = ref();
const noticeImagesFiles = ref([]);
const editMode = ref(false);

const masterNoticeApi = new MasterNoticeApi();
const hqNoticeApi = new HQNoticeApi();

const checkForm = () => {
  try {
    if (!title.value) throw new Error('제목을 입력해주세요.');
    if (!content.value) throw new Error('내용을 입력해주세요.');

    return true;
  } catch (e) {
    toast.add({ severity: 'error', summary: '입력 확인', detail: e.message, life: 3000 });
    return false;
  }
};

const onSubmit = async () => {
  const isPass = checkForm();
  if (!isPass) return;

  let uploadFiles = noticeImagesFiles.value.map(e => e.file);

  try {
    let successMsg = '';

    if (editMode.value) {
      // 수정

      await masterNoticeApi.editNotice({
        noticeCode,
        title: title.value,
        content: content.value,
        imageFiles: uploadFiles,
      });
      successMsg = '공지사항이 수정되었습니다.';
    } else {
      // 등록

      await masterNoticeApi.createNotice({ title: title.value, content: content.value, imageFiles: uploadFiles });
      successMsg = '공지사항이 등록되었습니다.';
    }

    toast.add({ severity: 'success', summary: '처리 성공', detail: successMsg, life: 3000 });
    router.replace({ name: 'hq:board:notice:list' });
  } catch (e) {
    // 오류 발생
    console.log(e);
  }
};

const clickChoose = () => {
  inputRef.value?.click();
};

const changeFile = event => {
  const { files } = event.target;
  if (files.length > 0) {
    const newImageFiles = Array.from(files).map(e => ({ file: e, preview: URL.createObjectURL(e) }));
    noticeImagesFiles.value = noticeImagesFiles.value.concat(newImageFiles);
  }
};

const clickRemoveImage = targetIndex => {
  noticeImagesFiles.value = noticeImagesFiles.value.filter((e, i) => i !== targetIndex);
};

watch(
  () => route.params.noticeCode,
  newVal => {
    if (newVal) {
      // 수정모드
      editMode.value = true;

      hqNoticeApi.getNotice(noticeCode).then(data => {
        title.value = data.title;
        content.value = data.content;
        noticeImagesFiles.value = []; // 이미지는 다시 선택해야함(기존에 이미지 있었더라도.)
      });
    } else {
      // 등록모드
      editMode.value = false;

      title.value = '';
      content.value = '';
      noticeImagesFiles.value = [];
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  // 남아있는 리소스 정리
  noticeImagesFiles.value.forEach(e => {
    URL.revokeObjectURL(e);
  });
});
</script>

<style scoped>
.notice-form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .upload-image-area {
    display: flex;
    gap: 16px;

    .upload-button,
    .upload-image-item {
      width: 100px;
      height: 100px;
      border-radius: 5px;
    }

    .upload-button {
      background-color: var(--p-surface-100);
      border: none;
      outline: none;
      display: flex;
      flex-direction: column;
      gap: 5px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: var(--p-surface-200);
      }
    }

    .upload-image-list {
      list-style-type: none;
      padding: 0;
      display: flex;
      gap: 20px;

      .upload-image-item {
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
        border: 1px solid var(--p-content-border-color);
        position: relative;

        .remove-button {
          position: absolute;
          top: -16px;
          right: -16px;
        }
      }
    }
  }
}
</style>
