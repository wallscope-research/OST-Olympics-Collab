<template lang="pug">
#medalsContainer
  h2.chart-title Medals By Age
  chart(:options='bar', ref='bar', theme='ovilia-green', autoresize)
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
    // dataset: {
    //   // Provide data.
    //   source: [
    //     ['age', 'numberofmedals'],
    //     ['15', '3'],
    //     ['16', '5'],
    //     ['17', '9'],
    //     ['18', '16'],
    //     ['19', '39'],
    //     ['20', '42'],
    //     ['21', '88'],
    //     ['22', '180'],
    //     ['23', '362'],
    //     ['24', '528'],
    //     ['25', '774'],
    //     ['26', '852'],
    //     ['27', '955'],
    //     ['28', '1063'],
    //     ['29', '1115'],
    //     ['30', '1223'],
    //     ['31', '1263'],
    //     ['32', '1290'],
    //     ['33', '1321'],
    //     ['34', '1346'],
    //     ['35', '1349'],
    //     ['36', '1352'],
    //     ['37', '1353'],
    //   ],
    // },
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