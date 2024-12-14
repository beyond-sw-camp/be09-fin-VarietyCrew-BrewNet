<template>
  <Card class="dashboard-chart-card">
    <template #content>
      <div class="card-title">
        <h3>주문 통계</h3>
        <div class="select-date">
          <AppDateRangePicker v-model:start="startDate" v-model:end="endDate" label="기간 설정" label-position="left" />
          <Button size="small" icon="pi pi-search" label="조회" @click="onSearch" />
        </div>
        <h3 style="visibility: hidden">주문 통계</h3>
      </div>
      <div class="chart-area">
        <Bar
          :options="{ responsive: false }"
          :data="{
            labels: ['주문', '교환', '반품'],
            datasets: [
              {
                label: '주문/교환/반품 수',
                data: [orderCount, exchangeCount, returnCount],
                backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(255, 99, 132)'],
                borderWidth: 1,
              },
            ],
          }"
        />
        <Pie
          :options="{ responsive: false }"
          :data="{
            labels: pieChartLabels,
            datasets: [
              {
                backgroundColor: pieChartColors,
                data: pieChartData,
              },
            ],
          }"
        />

        <div>
          <h4>주문 건수 TOP 10 상품</h4>
          <ul class="top-10-list">
            <li v-for="(statistics, index) in itemStatistics" :key="statistics.itemName">
              {{ index + 1 }}. {{ statistics.itemName }}({{ statistics.itemPercent }}%,
              {{ statistics.itemCount.toLocaleString() }}건)
            </li>
          </ul>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import { Bar, Pie } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale);

import HQStatisticsApi from '@/utils/api/HQStatisticsApi';

import AppDateRangePicker from '../common/form/AppDateRangePicker.vue';

const startDate = ref(dayjs().subtract(30, 'day').toDate());
const endDate = ref(new Date());
const orderCount = ref(0);
const exchangeCount = ref(0);
const returnCount = ref(0);
const pieChartLabels = ref([]);
const pieChartData = ref([]);
const pieChartColors = ref([]);
const itemStatistics = ref([]);

const hqStatisticsApi = new HQStatisticsApi();

const getRandomColor = () => Math.floor(Math.random() * 16777215).toString(16);

const getGraphData = () => {
  hqStatisticsApi.getOrderGraphData(startDate.value, endDate.value).then(data => {
    orderCount.value = data.orderCount;
    exchangeCount.value = data.exchangeCount;
    returnCount.value = data.returnCount;

    pieChartLabels.value = data.items.map(e => e.itemName);
    pieChartData.value = data.items.map(e => e.itemCount);

    // 랜덤 color 생성
    if (pieChartColors.value.length === 0) {
      const colors = [];
      for (let i = 0; i < data.items.length; i++) {
        colors.push(`#${getRandomColor()}`);
      }
      pieChartColors.value = colors;
    }

    itemStatistics.value = data.items;
  });
};
const onSearch = () => {
  getGraphData();
};

onMounted(() => {
  getGraphData();
});
</script>

<style scoped>
.dashboard-chart-card {
  box-shadow: var(--p-primary-100) 0px 2px 8px 0px;

  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .select-date {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .chart-area {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .top-10-list {
    list-style-type: none;
    padding: 0;

    h4 {
      margin-bottom: 10px;
    }

    li {
      color: var(--p-surface-500);
      font-size: 14px;
      line-height: 1.6;
    }
  }
}
</style>
