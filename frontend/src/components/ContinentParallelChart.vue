
<template lang="pug">
div 
  h2.chart-title Statistic comparison
  #parallel-continent
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as d3 from 'd3';

@Component
export default class Continent extends Vue {
  margin = { top: 20, right: 20, bottom: 30, left: 50 };
  width = 960 - this.margin.left - this.margin.right;
  height = 500 - this.margin.top - this.margin.bottom;
  lineHeight = this.height + 30;
  verticalSpacer = this.width / 4;
  categories = ['Age', 'Height', 'Weight', '# Of Medals'];

  parseCSV() {}

  mounted() {
    const container = d3
      .select('#parallel-continent')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const height = this.height;
    const width = this.width;
    const margin = this.margin;
    const lines: { [key: string]: { continent: number; rest: number } } = {
      age: { continent: 22, rest: 26 },
      height: { continent: 176, rest: 170 },
      weight: { continent: 75, rest: 83 },
      numberofmedals: { continent: 6, rest: 3 },
    };
    const keys = Object.keys(lines);

    var y: { [key: string]: any } = {};
    keys.forEach((k: string) => {
      // const max = Math.max(lines[k].continent, lines[k].rest);
      const arr = [lines[k].continent, lines[k].rest];

      y[k] = d3
        .scaleLinear()
        //@ts-ignore
        .domain(d3.extent(arr))
        .range([height + margin.top, 0]);
    });
    console.log(y);
    const x = d3.scalePoint().range([0, width]).padding(1).domain(keys);

    const continentLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      continentLine.push([x(key)!, lines[key].continent]);
    });
    const restLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      restLine.push([x(key)!, lines[key].rest]);
    });
    console.log(continentLine);
    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    const lineGenerator = d3.line();

    const athPath = (d: any) => {
      return lineGenerator(continentLine);
    };

    const restPath = (d: any) => {
      return lineGenerator(restLine);
    };
    container
      .selectAll('continentLine')
      .data(Object.values(lines))
      .enter()
      .append('path')
      .attr('d', athPath)
      .style('fill', 'none')
      .style('stroke', '#69b3a2')
      .style('stroke-width', '4px')
      .style('opacity', 0.8);

    container
      .selectAll('restLine')
      .data(Object.values(lines))
      .enter()
      .append('path')
      .attr('d', restPath)
      .style('fill', 'none')
      .style('stroke', '#404080')
      .style('stroke-width', '4px')
      .style('opacity', 0.8);

    // Draw the axis:
    container
      .selectAll('myAxis')
      // For each dimension of the dataset I add a 'g' element:
      .data(keys)
      .enter()
      .append('g')
      // I translate this element to its right position on the x axis
      .attr('transform', function (d) {
        return 'translate(' + x(d) + ')';
      })
      // And I build the axis with the call function
      .each(function (d) {
        d3.select(this).call(d3.axisLeft(y[d]));
      })
      // Add axis title
      .append('text')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left - 20)
      .attr('x', -margin.top)
      .text(function (d) {
        return d;
      })
      .style('fill', 'black')
      .style('font-size', '16px');

    container
      .append('circle')
      .attr('cx', 10)
      .attr('cy', 130)
      .attr('r', 6)

      .style('fill', '#69b3a2');
    container
      .append('circle')
      .attr('r', 6)
      .attr('cy', 160)
      .attr('cx', 10)
      .style('fill', '#404080');
    container
      .append('text')
      .text('Athlete Stats')
      .attr('y', 130)
      .attr('x', 20)
      .style('font-size', '15px')
      .attr('alignment-baseline', 'middle');
    container
      .append('text')
      .attr('y', 160)
      .attr('x', 20)
      .text('Continent Stats')
      .style('font-size', '15px')
      .attr('alignment-baseline', 'middle');
  }
}
</script>


<style lang="scss">
</style>