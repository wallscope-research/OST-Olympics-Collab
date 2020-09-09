<template lang="pug">
#medalsContainer
  h2.chart-title Medals By Age
  chart(:options='bar', ref='bar')
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ECharts from 'vue-echarts'; // refers to components/ECharts.vue in webpack
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
@Component({
  components: {
    chart: ECharts,
  },
})
export default class MedalsAtAge extends Vue {
  bar = {
    legend: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    // Declare X axis, which is a category axis, mapping
    // to the first column by default.
    xAxis: { type: 'category', data: Array.from(Array(23), (_, i) => i + 23) },
    // Declare Y axis, which is a value axis.
    yAxis: {},
    // Declare several series, each of them mapped to a
    // column of the dataset by default.
    series: [
      {
        data: [
          { value: 3, itemStyle: { color: 'red' } },
          { value: 5, itemStyle: { color: 'red' } },
          { value: 9, itemStyle: { color: 'red' } },
          { value: 16, itemStyle: { color: 'red' } },
          { value: 39, itemStyle: { color: 'red' } },
          { value: 42, itemStyle: { color: 'red' } },
          { value: 88, itemStyle: { color: 'red' } },
          { value: 180, itemStyle: { color: 'red' } },
          { value: 362, itemStyle: { color: 'red' } },
          { value: 528, itemStyle: { color: 'green' } },
          { value: 774, itemStyle: { color: 'red' } },
          { value: 852, itemStyle: { color: 'red' } },
          { value: 955, itemStyle: { color: 'red' } },
          { value: 1063, itemStyle: { color: 'red' } },
          { value: 1115, itemStyle: { color: 'red' } },
          { value: 1223, itemStyle: { color: 'red' } },
          { value: 1263, itemStyle: { color: 'red' } },
          { value: 1290, itemStyle: { color: 'red' } },
          { value: 1321, itemStyle: { color: 'red' } },
          { value: 1346, itemStyle: { color: 'red' } },
          { value: 1349, itemStyle: { color: 'red' } },
          { value: 1352, itemStyle: { color: 'red' } },
          { value: 1353, itemStyle: { color: 'red' } },
        ],
        type: 'bar',
      },
    ],
  };
  randomize() {
    return [0, 0, 0].map((v) => {
      return Math.round(300 + Math.random() * 700) / 10;
    });
  }
}
</script>


<style lang="scss">
#medalsContainer {
  display: grid;
  grid-template-columns: 1fr;
  align-content: center;
}
</style>