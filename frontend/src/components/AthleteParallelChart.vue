<template lang="pug">
div 
  h2.chart-title Statistic comparison
  #parallel-athlete
  #dropdowns
    #continent-dropdown
      h3.chart-subtitle Compare by continent
      v-select(
        v-model='selectedContinent',
        :options='continents',
        :placeholder='"Select a continent"'
      )
    #sport-dropdown
      h3.chart-subtitle Compare by sport
      v-select(:options='["Tennis", "Football"]', :placeholder='"Select a sport"')
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import * as d3 from 'd3';
import athletesM, { Athlete } from '@/store/athletesM';
import continentsM, { continentMap } from '@/store/continentsM';

@Component({ components: { 'v-select': vSelect } })
export default class ParallelChart extends Vue {
  @Prop({ required: true }) athlete!: Athlete;
  margin = { top: 20, right: 20, bottom: 30, left: 50 };
  width = 960 - this.margin.left - this.margin.right;
  height = 500 - this.margin.top - this.margin.bottom;
  lineHeight = this.height + 30;
  verticalSpacer = this.width / 4;
  categories = ['Age', 'Height', 'Weight', '# Of Medals'];
  selectedContinent: string = '';

  limits: { [key: string]: { min: number; max: number } } = {
    height: { min: 127, max: 226 },
    weight: { min: 25, max: 214 },
    age: { min: 10, max: 97 },
    'Number of medals': { min: 0, max: 28 },
  };
  rest: any = null;

  get continents() {
    const arr = Object.keys(continentMap);
    const ret = arr.concat('All continents');
    return ret;
  }

  async draw() {
    await athletesM.fetchAverageStats({});
    const container = d3
      .select('#parallel-athlete')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const height = this.height;
    const width = this.width;
    const margin = this.margin;
    const averages = athletesM.getAverateStats;

    const lines: { [key: string]: { athlete: number; rest: number } } = {
      age: { athlete: this.athlete.age!, rest: averages.age },
      height: { athlete: this.athlete.height!, rest: averages.height },
      weight: { athlete: this.athlete.weight!, rest: averages.weight },
      'Number of medals': { athlete: this.athlete.medals!, rest: averages.medals },
    };

    const keys = Object.keys(lines);

    var y: { [key: string]: any } = {};
    keys.forEach((k: string) => {
      const max = this.limits[k].max;
      const min = this.limits[k].min;
      const arr = [min - 5, max + 5];

      y[k] = d3
        .scaleLinear()
        //@ts-ignore
        .domain(d3.extent(arr))
        .range([height - 20, 5]);
    });

    const x = d3.scalePoint().range([0, width]).padding(1).domain(keys);

    const athleteLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      athleteLine.push([x(key)!, y[key](lines[key].athlete)]);
    });
    const restLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      restLine.push([x(key)!, y[key](lines[key].rest)]);
    });

    const makeAthLine = (d: any) => {
      return d3.line()(athleteLine);
    };

    const makeRestLine = (d: any) => {
      return d3.line()(restLine);
    };

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
      .selectAll('athleteLine')
      .data(Object.values(lines))
      .enter()
      .append('path')
      .attr('class', 'athleteline')
      .attr('d', makeAthLine)
      // .transition()
      // .duration(750)
      .style('fill', 'none')
      .style('stroke', '#69b3a2')
      .style('stroke-width', '2px')
      .style('opacity', 0.8);

    this.rest = container
      .selectAll('restLine')
      .data(Object.values(lines))
      .enter()
      .append('path')
      .attr('class', 'restline')
      .attr('d', makeRestLine)
      .style('fill', 'none')
      .style('stroke', '#000000')
      .style('stroke-width', '2px')
      .style('opacity', 0.8);

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
      .text('Average Stats')
      .style('font-size', '15px')
      .attr('alignment-baseline', 'middle');
  }

  async reDraw() {
    console.log(athletesM.getAverateStats);
    if (!continentMap[this.selectedContinent]) await athletesM.fetchAverageStats({});
    else
      await athletesM.fetchAverageStats({ continent: continentMap[this.selectedContinent] });
    const averages = athletesM.getAverateStats;
    console.log(averages);
    // const averages = {
    //   age: 35,
    //   height: 200,
    //   weight: 110,
    //   medals: 6,
    // };

    const height = this.height;
    const width = this.width;
    const margin = this.margin;

    //get data again
    const lines: { [key: string]: { athlete: number; rest: number } } = {
      age: { athlete: this.athlete.age!, rest: averages.age },
      height: { athlete: this.athlete.height!, rest: averages.height },
      weight: { athlete: this.athlete.weight!, rest: averages.weight },
      'Number of medals': { athlete: this.athlete.medals!, rest: averages.medals },
    };

    const keys = Object.keys(lines);

    //rescale x and y
    const x = d3.scalePoint().range([0, width]).padding(1).domain(keys);

    var y: { [key: string]: any } = {};
    keys.forEach((k: string) => {
      const max = this.limits[k].max;
      const min = this.limits[k].min;
      const arr = [min - 5, max + 5];

      y[k] = d3
        .scaleLinear()
        //@ts-ignore
        .domain(d3.extent(arr))
        .range([height - 20, 5]);
    });

    //get two lines.
    const athleteLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      athleteLine.push([x(key)!, y[key](lines[key].athlete)]);
    });
    const restLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      restLine.push([x(key)!, y[key](lines[key].rest)]);
    });

    const makeAthLine = (d: any) => {
      return d3.line()(athleteLine);
    };

    const makeRestLine = (d: any) => {
      return d3.line()(restLine);
    };

    this.rest.attr('d', makeRestLine);
  }
  mounted() {
    this.draw();
  }

  @Watch('selectedContinent')
  doSomething() {
    console.log(this.selectedContinent);
    this.reDraw();
  }
}
</script>


<style lang="scss">
#parallel {
  margin: 10px;
  display: flex;
  justify-content: center;
}

#dropdowns {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#continent-dropdown,
#sport-dropdown {
  margin: 5px;
}
#continent-dropdown {
  grid-column: 1;
}

#sport-dropdown {
  grid-column: 2;
}
</style>