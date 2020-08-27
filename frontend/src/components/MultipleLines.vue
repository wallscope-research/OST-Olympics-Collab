<template lang="pug">
#multipleLines
  h1 {{ title }}
  chart(:options='line', ref='line', autoresize)
</template>



<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ECharts from 'vue-echarts'; // refers to components/ECharts.vue in webpack
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
@Component({
  components: {
    chart: ECharts,
  },
})
export default class MutipleLines extends Vue {
  @Prop() propOptions!: {
    data: string[];
    series: {
      data: number[];
      type: string;
    }[];
  };
  @Prop() title!: string;
  line = {
    title: {
      text: 'Ages over time',
    },
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
    yAxis: {
      type: 'value',
    },
    legend: {}, //need this to show legend
    xAxis: {
      type: 'category',
      data: this.propOptions.data,
    },
    series: this.propOptions.series,
  };

  // @Watch('propOptions')
  // updateData() {
  //   //@ts-ignore
  //   console.log(this.propOtions);
  //   this.$refs.line.setOption(this.propOtions);
  // }
}
</script>

<style lang="scss">
</style>