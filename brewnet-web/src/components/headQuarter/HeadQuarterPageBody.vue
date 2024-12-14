<template>
  <div class="page-body">
    <!-- side bar -->
    <SideMenuBar />

    <main>
      <Breadcrumb :home="home" :model="breadcrumbs" />
      <PageTitle>{{ currentPageTitle }}</PageTitle>
      <div class="content">
        <RouterView />
      </div>

      <LoadingSpinner />
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import PageTitle from './PageTitle.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import SideMenuBar from '../common/SideMenuBar.vue';

const route = useRoute();

const currentPageTitle = computed(() => {
  return route.meta?.breadcrumb || '';
});

const breadcrumbs = computed(() => {
  const matchedRoutes = route.matched;
  return matchedRoutes
    .filter(e => e.meta.breadcrumb)
    .map(e => ({
      label: e.meta.breadcrumb,
    }));
});

const home = ref({
  icon: 'pi pi-home',
});
</script>

<style scoped>
.page-body {
  flex-grow: 1;
  display: flex;
  overflow-y: auto;

  main {
    flex-grow: 1;
    overflow-y: auto;
    padding: 5px 5px 20px 5px;
    position: relative;

    .page-title {
      margin: 0 14px;
      padding-left: 10px;
      border-left: 5px solid var(--p-primary-600);
    }

    .content {
      margin-top: 24px;
      padding: 0 14px;
    }
  }
}
</style>
