<template lang="pug">
div 
  h2.chart-title Statistic comparison
  #parallel
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as d3 from 'd3';
@Component
export default class ParallelChart extends Vue {
  margin = { top: 20, right: 20, bottom: 30, left: 50 };
  width = 960 - this.margin.left - this.margin.right;
  height = 500 - this.margin.top - this.margin.bottom;
  lineHeight = this.height + 30;
  verticalSpacer = this.width / 4;
  categories = ['Age', 'Height', 'Weight', '# Of Medals'];

  parseCSV() {
    d3.csv('/mock/ath2.csv').then(function (data) {
      console.log(data);
    });
  }

  mounted() {
    this.parseCSV();
    const container = d3
      .select('#parallel')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    for (var i = 0; i < 4; i++) {
      container
        .append('line')
        .attr('x1', 20 + this.verticalSpacer * i)
        .attr('y1', 30)
        .attr('x2', 20 + this.verticalSpacer * i)
        .attr('y2', this.lineHeight)
        .attr('stroke-width', 2)
        .attr('stroke', 'black');

      container
        .append('text')
        .attr('transform', 'translate(' + this.verticalSpacer * i + ',' + 15 + ')')
        .attr('text-anchor', 'center')
        .style('fill', 'steelblue')
        .text(this.categories[i]);
    }
  }
}
</script>


<style lang="scss">
#parallel {
  margin: 10px;
  display: flex;
  justify-content: center;
}
</style>