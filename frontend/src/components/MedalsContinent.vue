<template lang="pug">
chart(:options='stackedBars', ref='stackedBars', autoresize)
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ECharts from 'vue-echarts'; // refers to components/ECharts.vue in webpack
import 'echarts/lib/chart/bar';

@Component({
  components: {
    chart: ECharts,
  },
})
export default class MedalsContinent extends Vue {
  stackedBars = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
      },
    ],
  };
}
</script>


<template lang="pug">
</template>