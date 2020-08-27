<template lang="pug">
div
  h2.chart-title Medals Per Continent
  #bar-container
    chart(:options='bar')
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
export default class SportsBar extends Vue {
  medals = {
    2004: {
      Africa: { men: 156, women: 58 },
      Asia: { men: 205, women: 197 },
      Europe: { men: 189, women: 198 },
      'North America': { men: 297, women: 222 },
      Oceania: { men: 53, women: 68 },
      'South America': { men: 88, women: 76 },
    },
    2008: {
      Africa: { men: 197, women: 72 },
      Asia: { men: 296, women: 275 },
      Europe: { men: 263, women: 210 },
      'North America': { men: 378, women: 289 },
      Oceania: { men: 74, women: 121 },
      'South America': { men: 121, women: 104 },
    },
    2012: {
      Africa: { men: 233, women: 104 },
      Asia: { men: 389, women: 304 },
      Europe: { men: 299, women: 243 },
      'North America': { men: 437, women: 303 },
      Oceania: { men: 102, women: 169 },
      'South America': { men: 169, women: 157 },
    },
  };

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
      data: Object.keys(this.medals),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Africa Men',
        data: Object.values(this.medals).map((x) => x.Africa.men),
        type: 'bar',
      },
      {
        name: 'Africa Women',
        data: Object.values(this.medals).map((x) => x.Africa.women),
        type: 'bar',
      },
      {
        name: 'Asia Men',
        data: Object.values(this.medals).map((x) => x.Asia.men),
        type: 'bar',
      },
      {
        name: 'Asia women',
        data: Object.values(this.medals).map((x) => x.Asia.women),
        type: 'bar',
      },
      {
        name: 'Europe Men',
        data: Object.values(this.medals).map((x) => x.Europe.men),
        type: 'bar',
      },
      {
        name: 'Europe Women',
        data: Object.values(this.medals).map((x) => x.Europe.women),
        type: 'bar',
      },
      {
        name: 'North American Men',
        data: Object.values(this.medals).map((x) => x['North America'].men),
        type: 'bar',
      },
      {
        name: 'North American Women',
        data: Object.values(this.medals).map((x) => x['North America'].women),
        type: 'bar',
      },
      {
        name: 'Oceania Men',
        data: Object.values(this.medals).map((x) => x.Oceania.men),
        type: 'bar',
      },
      {
        name: 'Oceania Women',
        data: Object.values(this.medals).map((x) => x.Oceania.women),
        type: 'bar',
      },
      {
        name: 'South American Men',
        data: Object.values(this.medals).map((x) => x['South America'].men),
        type: 'bar',
      },
      {
        name: 'South American Women',
        data: Object.values(this.medals).map((x) => x['South America'].women),
        type: 'bar',
      },
    ],
  };
}
</script>