<template lang="pug">
div
  h2.chart-title Medals Per Continent
  #bar-container
    chart(:options='bar')
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
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
    [key: string]: {
      [key: string]: {
        medalCount: number;
        athleteCount: number;
      };
    };
  } | null;

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
      data: Object.keys(this.overTime!),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      ...Object.values(this.overTime!).map((year) => {
        return {
          name: Object.keys(year)[0] + ' Medal Count',
          data: Object.values(this.overTime!).map((y) => {
            return Object.values(y)[0].medalCount;
          }),
          type: 'bar',
        };
      }),
      ...Object.values(this.overTime!).map((year) => {
        return {
          name: Object.keys(year)[0] + ' Athlete Count',
          data: Object.values(this.overTime!).map((y) => {
            return Object.values(y)[0].athleteCount;
          }),
          type: 'bar',
        };
      }),
    ],
  };
  mounted() {
    console.log(this.overTime);
    console.log(Object.values(this.overTime!));
  }
}
</script>