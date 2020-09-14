<template lang="pug">
#medalsContainer
  h2.chart-title Medals By Age
  chart(:options='bar', ref='bar')
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ECharts from 'vue-echarts'; // refers to components/ECharts.vue in webpack
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import athletesM from '@/store/athletesM';
@Component({
  components: {
    chart: ECharts,
  },
})
export default class MedalsAtAge extends Vue {
  @Prop({ required: true }) averageMedalsPerAge!: { [key: number]: number };
  @Prop({ required: true }) athleteAge!: number;
  get bar() {
    return {
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
      xAxis: { type: 'category', data: this.ages },
      // Declare Y axis, which is a value axis.
      yAxis: {},
      // Declare several series, each of them mapped to a
      // column of the dataset by default.
      series: [
        {
          data: this.medals,
          type: 'bar',
        },
      ],
    };
  }

  get ages() {
    return Object.keys(this.averageMedalsPerAge);
  }
  get medals() {
    return Object.keys(this.averageMedalsPerAge).map((x) => {
      if (+x === this.athleteAge) {
        return { value: this.averageMedalsPerAge[+x], itemStyle: { color: '#69b3a2' } };
      } else return { value: this.averageMedalsPerAge[+x], itemStyle: { color: '#404080' } };
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