<template lang="pug">
#medalsContainer
  h2.chart-title Average Medals By Age
  .legendContainer 
    .athleteLegend
      | &nbsp;
    p.legend Athlete's Age
    .restLegend
      | &nbsp;
    p.legend All other ages
  chart(:options='bar', ref='bar')
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
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
        return {
          value: Math.round((this.averageMedalsPerAge[+x] + Number.EPSILON) * 100) / 100,
          itemStyle: { color: '#69b3a2' },
        };
      } else
        return {
          value: Math.round((this.averageMedalsPerAge[+x] + Number.EPSILON) * 100) / 100,
          itemStyle: { color: '#404080' },
        };
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

.legend {
  font-size: 12px;
}

.athleteLegend {
  width: 18px;
  height: 18px;
  margin-right: 5px;
  margin-left: 5px;
  background-color: #69b3a2;
}

.restLegend {
  width: 18px;
  height: 18px;
  margin-right: 5px;
  margin-left: 5px;
  background-color: #404080;
}

.legendContainer {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
}
</style>