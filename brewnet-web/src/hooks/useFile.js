import { onUnmounted, ref } from 'vue';

export function useFile() {
  const previewUrl = ref(null);
  const file = ref(null);

  const onChangeFile = event => {
    const { files } = event.target;
    if (files.length > 0) {
      const newFile = files[0];

      // 기존 파일 지우고
      URL.revokeObjectURL(previewUrl);

      // 새로운 파일로 교체
      previewUrl.value = URL.createObjectURL(newFile);
      file.value = newFile;
    }
  };

  const onRemove = () => {
    previewUrl.value = null;
    file.value = null;

    URL.revokeObjectURL(previewUrl);
  };

  onUnmounted(() => {
    // 남아있는 리소스 정리
    URL.revokeObjectURL(previewUrl);
  });

  return { previewUrl, file, onChangeFile, onRemove };
}
