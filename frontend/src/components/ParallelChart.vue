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

    // for (var i = 0; i < 4; i++) {
    //   container
    //     .append('line')
    //     .attr('x1', 20 + this.verticalSpacer * i)
    //     .attr('y1', 30)
    //     .attr('x2', 20 + this.verticalSpacer * i)
    //     .attr('y2', this.lineHeight)
    //     .attr('stroke-width', 2)
    //     .attr('stroke', 'black');

    //   container
    //     .append('text')
    //     .attr('transform', 'translate(' + this.verticalSpacer * i + ',' + 15 + ')')
    //     .attr('text-anchor', 'center')
    //     .style('fill', 'steelblue')
    //     .text(this.categories[i]);
    // }

    const height = this.height;
    const width = this.width;
    const margin = this.margin;
    d3.csv('/mock/ath2.csv').then(function (data) {
      const keys = data.map((x) => x.line!);
      console.log(keys);
      const athlete: { [key: string]: number } = {
        age: 0,
        height: 0,
        weight: 0,
        numberofmedals: 0,
      };
      const rest: { [key: string]: number } = {
        age: 0,
        height: 0,
        weight: 0,
        numberofmedals: 0,
      };

      console.log(data);
      const y: { [name: string]: any } = {};
      for (var i = 0; i < keys.length; i++) {
        const name = keys[i];
        athlete[name] += +data[i].athlete!;
        rest[name] += +data[i].rest!;
        const vals = data.map((x) => x[name]!);
        y[name] = d3
          .scaleLinear()
          .domain(
            //@ts-ignore
            d3.extent(data, function (d) {
              return +d[name]!;
            })
          )
          .range([height, 0]);
      }

      const x = d3.scalePoint().range([0, width]).padding(1).domain(keys);
      const athleteLine: [number, number][] = keys.map(function (k) {
        return [x(k)!, athlete[k]!];
      });
      const restLine: [number, number][] = keys.map(function (k) {
        return [x(k)!, rest[k]];
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
        .data(data)
        .enter()
        .append('path')
        .attr('d', athPath)
        .style('fill', 'none')
        .style('stroke', '#69b3a2')
        .style('opacity', 0.8);

      container
        .selectAll('restLine')
        .data(data)
        .enter()
        .append('path')
        .attr('d', restPath)
        .style('fill', 'none')
        .style('stroke', '#000000')
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
        .style('fill', 'black');
      // .style('text-anchor', 'middle')

      // .style('fill', 'red');
    });
  }
}
</script>


<style lang="scss">
#parallel {
  margin: 10px;
}
</style>