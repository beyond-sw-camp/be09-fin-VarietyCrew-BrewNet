<template>
  <div class="delivery-main-container">
    <header>
      <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
      <h3>{{ $route.meta?.pageTitle || '' }}</h3>
      <div>
        <Button label="로그아웃" variant="text" size="small" @click="clickLogout" />
        <Button label="강제 로그아웃(임시)" variant="text" size="small" @click="clickForceLogout" />
      </div>
    </header>
    <main>
      <RouterView />

      <LoadingSpinner />
    </main>
    <footer>
      <nav>
        <RouterLink
          v-for="navItem in navItems"
          :key="navItem.routerName"
          :to="{ name: navItem.routerName }"
          class="tab-link"
          active-class="active"
          >{{ navItem.title }}</RouterLink
        >
      </nav>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useUserStore } from '@/stores/user';
import AuthApi from '@/utils/api/AuthApi';

const userStore = useUserStore();
const router = useRouter();

const authApi = new AuthApi();

const navItems = ref([
  { routerName: 'd:home', title: '주문' },
  { routerName: 'd:exchange-return', title: '교환/반품' },
  { routerName: 'd:detail', title: '배송 현황' },
]);

const clickLogout = () => {
  authApi.logout().then(() => {
    userStore.clearUserData();
    router.replace({ name: 'auth:login' });
  });
};

const clickForceLogout = () => {
  userStore.clearUserData();
  router.replace({ name: 'auth:login' });
};
</script>

<style scoped>
.delivery-main-container {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100dvh;
  margin: 0 auto;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-bottom: 2px solid var(--p-surface-100);

    .logo {
      width: 50px;
      height: 50px;
    }
  }

  main {
    flex-grow: 1;
    position: relative;
  }

  footer {
    border-top: 2px solid var(--p-surface-100);

    nav {
      display: flex;

      & > * {
        flex: 1 1;
      }
    }
    .tab-link {
      text-align: center;
      color: var(--p-surface-700);
      padding: 16px 0;

      &.active {
        background-color: var(--p-primary-600);
        color: white;
        font-weight: bold;
      }
    }
  }
}
</style>
