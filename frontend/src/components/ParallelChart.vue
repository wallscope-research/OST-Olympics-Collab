<template lang="pug">
div 
  h2.chart-title Statistic comparison
  #parallel
</template>


<script lang="ts">
// export class y {
//   name: string;
//   val: number;

//   constructor(name: string, val: number) {
//     this.name = name;
//     this.val = val;
//   }
// }
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

  parseCSV() {}

  mounted() {
    const container = d3
      .select('#parallel')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const height = this.height;
    const width = this.width;
    const margin = this.margin;
    const lines: { [key: string]: any } = {
      age: { athlete: 22, rest: 26 },
      height: { athlete: 176, rest: 170 },
      weight: { athlete: 75, rest: 83 },
      numberofmedals: { athlete: 6, rest: 3 },
    };
    const keys = Object.keys(lines);

    var y: { [key: string]: any } = {};
    keys.forEach((k: string) => {
      const max = Math.max(lines[k].athelte, lines[k].rest);

      y[k] = d3.scaleLinear().domain([0, max]).range([max, 0]);
    });

    const x = d3.scalePoint().range([0, width]).padding(1).domain(keys);

    const athleteLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      athleteLine.push([x(key)!, lines[key].athlete]);
    });
    const restLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      restLine.push([x(key)!, lines[key].rest]);
    });
    console.log(athleteLine);
    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    const lineGenerator = d3.line();

    const athPath = (d: any) => {
      return lineGenerator(athleteLine);
    };

    const restPath = (d: any) => {
      return lineGenerator(restLine);
    };
    container
      .selectAll('athleteLine')
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
      .style('stroke', '#000000')
      .style('stroke-width', '4px')
      .style('opacity', 0.8);

    // Draw the lines
    // container
    //   .selectAll('myPath')
    //   .data(data)
    //   .enter()
    //   .append('path')
    //   .attr('d', path)
    //   .style('fill', 'none')
    //   .style('stroke', '#69b3a2')
    //   .style('opacity', 0.5);

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
      .attr('y', -margin.left + 20)
      .attr('x', -margin.top)
      .text(function (d) {
        console.log(d);
        return d;
      })
      .style('fill', 'black')
      .style('font-size', '16px');
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