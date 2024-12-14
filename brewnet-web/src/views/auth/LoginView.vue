<template>
  <form class="login-container" @submit.prevent="login">
    <!-- 아이디 -->
    <IconField>
      <InputIcon class="pi pi-user" />
      <InputText v-model="id" placeholder="아이디 입력" fluid class="input" />
    </IconField>

    <!-- 패스워드 -->
    <IconField>
      <InputIcon class="pi pi-lock" />
      <InputText v-model="password" placeholder="비밀번호 입력" fluid class="input" type="password" />
    </IconField>

    <div class="middle">
      <AppCheck v-model="saveAuth" label="로그인 정보 저장" />
      <Button label="비밀번호 찾기" variant="text" size="small" as="router-link" :to="{ name: 'auth:find-password' }" />
    </div>

    <Button label="로그인" type="submit" />
  </form>
</template>

<script setup>
import { jwtDecode } from 'jwt-decode';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePreset } from '@primevue/themes';

import AppCheck from '@/components/common/form/AppCheck.vue';
import { useUserStore } from '@/stores/user';
import AuthApi from '@/utils/api/AuthApi';
import MemberApi from '@/utils/api/MemberApi';
import { ROLE } from '@/utils/constant';
import LocalStorageUtil from '@/utils/localStorage';
import AppPresetFC from '@/assets/AppPresetFC';
import AppPreset from '@/assets/AppPreset';

const userStore = useUserStore();
const router = useRouter();
const toast = useToast();

const id = ref('');
const password = ref('');
const saveAuth = ref(false);

const localStorageUtil = new LocalStorageUtil();
const authApi = new AuthApi();
const memberApi = new MemberApi();

const checkForm = () => {
  try {
    if (!id.value) throw new Error('아이디를 입력해주세요.');
    if (!password.value) throw new Error('비밀번호를 입력해주세요.');
  } catch (e) {
    toast.add({ severity: 'error', summary: '입력 확인', detail: e.message, life: 3000 });
    return false;
  }

  return true;
};

const login = async () => {
  const isPass = checkForm();
  if (!isPass) return;

  try {
    await authApi.login(id.value, password.value);

    // 로그인 후 temp access token, temp refresh token 셋팅 완료되어있음

    // token decode 진행 -> 유저타입 확인
    const { authorities } = jwtDecode(userStore.tempAccessToken);

    let userType;
    if (authorities.includes(ROLE.FRANCHISE)) {
      userType = 'fc';
    } else if (authorities.includes(ROLE.DELIVERY)) {
      userType = 'd';
    } else if (
      authorities.includes(ROLE.GENERAL_ADMIN) ||
      authorities.includes(ROLE.RESPONSIBLE_ADMIN) ||
      authorities.includes(ROLE.MASTER)
    ) {
      userType = 'hq';
    }

    // 유저 타입이 셋팅되지 않았다면 실패
    if (!userType) return;

    // 유저 타입 셋팅 성공
    // 유저 auth 데이터 셋팅
    userStore.setUserType(userType);
    userStore.saveTokenTempToReal(); // temp -> 진짜 토큰으로 셋팅

    if (userType === 'hq' || userType === 'fc') {
      const myInfo = await memberApi.getMyInfo();
      userStore.setUserData(myInfo); // 내 정보 셋팅
    }

    // 로그인 정보 저장할건지?
    localStorageUtil.handleRememberLoginId(saveAuth.value, id.value);

    // if (userType === 'fc') {
    //   usePreset(AppPresetFC)
    // } else {
    //   usePreset(AppPreset)
    // }

    // 메인 페이지로 이동
    router.replace({ name: `${userType}:home` });
  } catch (e) {
    // 실패한 경우 데이터 clear
    userStore.clearUserData();
  }
};

onMounted(() => {
  // 저장된 로그인 아이디가 있다면 default 셋팅
  const foundLoginId = localStorageUtil.getLoginId();
  if (foundLoginId) {
    id.value = foundLoginId;
  }
});
</script>

<style scoped>
.login-container {
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;

  .input {
    text-align: center;
  }

  .middle {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
