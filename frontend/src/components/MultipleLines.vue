<template lang="pug">
#multipleLines
  h2.chart-title {{ title }}
  chart(:options='line', ref='line', autoresize)
  v-select(
    v-if='sportsMap',
    v-model='selectedSport',
    :options='sports',
    :placeholder='"Select a sport"'
  )
</template>



<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import ECharts from 'vue-echarts'; // refers to components/ECharts.vue in webpack
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
@Component({
  components: {
    chart: ECharts,
    'v-select': vSelect,
  },
})
export default class MutipleLines extends Vue {
  @Prop({ required: true }) propOptions!: {
    data: string[];
    series: {
      data: number[];
      type: string;
    }[];
  };
  @Prop({ required: true }) title!: string;
  @Prop() sportsMap!: { [key: string]: string };
  @Prop() min!: number;
  @Prop() max!: number;
  selectedSport: string = '';
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
      min: this.min,
      max: this.max,
      type: 'value',
    },
    legend: {}, //need this to show legend
    xAxis: {
      type: 'category',
      data: this.propOptions.data,
    },
    series: this.propOptions.series,
  };

  get sports() {
    return ['All sports', ...Object.keys(this.sportsMap).sort()];
  }

  @Watch('selectedSport')
  sportSelected() {
    const uri = this.sportsMap[this.selectedSport];
    this.$emit('line-sport-selected', uri);
  }

  @Watch('min')
  minChanges() {
    this.line.yAxis.min = this.min;
  }

  @Watch('max')
  maxChanges() {
    this.line.yAxis.max = this.max;
  }
  @Watch('propOptions')
  updateData() {
    this.line.xAxis.data = this.propOptions.data;
    this.line.series = this.propOptions.series;
  }
}
</script>

<style lang="scss">
</style>