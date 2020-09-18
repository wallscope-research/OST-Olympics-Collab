<template lang="pug">
div
  h2.chart-title Medals Per Continent
  #bar-container
    chart(:options='bar')
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ECharts from 'vue-echarts'; // refers to components/ECharts.vue in webpack
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import { continentMap } from '@/store/continentsM';

@Component({
  components: {
    chart: ECharts,
  },
})
export default class SportsBar extends Vue {
  @Prop({ required: true }) overTime!: {
    name: string;
    type: string;
    data: number[];
  }[];

  dimensions = ['Medal count', 'Athlete Count'];
  bar = {
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
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    legend: {},
    xAxis: {
      type: 'category',
      data: this.dimensions,
    },
    yAxis: {
      type: 'value',
    },
    series: this.overTime,
  };

  @Watch('overTime')
  dataChanged() {
    this.bar.series = this.overTime;
  }
}
</script>