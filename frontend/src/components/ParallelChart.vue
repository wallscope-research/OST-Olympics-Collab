<template lang="pug">
div
  h2.chart-title Statistic comparison

  .wrapper
    #parallel-focus
    .dropdowns
      .dropdown
        h3.chart-subtitle Filter by continent
        v-select(
          v-model='selectedContinent',
          :options='continents',
          :placeholder='"Select a continent"'
        )
      .dropdown
        h3.chart-subtitle Filter by sport
        v-select(v-model='selectedSport', :options='sports', :placeholder='"Select a sport"')
      .dropdown
        h3.chart-subtitle Filter by gender
        v-select(
          v-model='selectedGender',
          :options='genders',
          :placeholder='"Select a gender"'
        )
      .notice(v-if='showNotice')
        p There is no data for {{ selectedSport }} {{ selectedGender }} athletes in {{ selectedContinent }}, please try changing the filters.
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import * as d3 from 'd3';
import { Averages, Athlete } from '@/store';

@Component({ components: { 'v-select': vSelect } })
export default class ParallelChart extends Vue {
  @Prop({ required: true }) legend!: string;
  @Prop({ required: true }) focus!: Averages;
  @Prop({ required: true }) comparison!: Averages;
  @Prop({ required: true }) continentMap!: { [key: string]: string };
  @Prop({ required: true }) sportsMap!: { [key: string]: string };
  margin = { top: 20, right: 20, bottom: 30, left: 50 };
  width = 800 - this.margin.left - this.margin.right;
  height = 500 - this.margin.top - this.margin.bottom;
  ratio = this.width / this.height;
  heightRatio = this.height / 1920;
  widthRatio = this.width / 696;
  categories = ['Age', 'Height', 'Weight', '# Of Medals'];
  selectedContinent: string = '';
  selectedSport: string = '';
  selectedGender: string = '';
  isSmall = false;
  x: d3.ScalePoint<string> | null = null;
  y: { [key: string]: any } = {};
  genderMap: { [key: string]: string } = {
    Male: 'http://wallscope.co.uk/resource/olympics/gender/M',
    Female: 'http://wallscope.co.uk/resource/olympics/gender/F',
  };

  limits: { [key: string]: { min: number; max: number } } = {
    height: { min: 127, max: 226 },
    weight: { min: 25, max: 214 },
    age: { min: 10, max: 97 },
    'Number of medals': { min: 0, max: 28 },
  };
  rest: any = null;
  container: any = null;
  get continents() {
    return ['All continents', ...Object.keys(this.continentMap).sort()];
  }

  get sports() {
    return ['All sports', ...Object.keys(this.sportsMap).sort()];
  }

  get genders() {
    return ['All Genders', 'Female', 'Male'];
  }

  get showNotice() {
    return !this.comparison.isComplete() || !this.focus.isComplete();
  }

  get getWidth() {
    return this.width;
  }

  get getHeight() {
    return this.height;
  }

  mounted() {
    this.draw();
    console.log(this.widthRatio, this.heightRatio);
    console.log(document.getElementById('container-svg'));
  }

  @Watch('selectedContinent')
  continentSelected() {
    const uri = this.continentMap[this.selectedContinent];
    this.$emit('continent-selected', uri);
  }

  @Watch('selectedSport')
  sportSelected() {
    const uri = this.sportsMap[this.selectedSport];
    this.$emit('sport-selected', uri);
  }

  @Watch('selectedGender')
  genderSelected() {
    const uri = this.genderMap[this.selectedGender];
    this.$emit('gender-selected', uri);
  }

  @Watch('comparison')
  averageWatcher() {
    this.reDraw();
  }
  @Watch('focus')
  focusWatcher() {
    this.reDraw();
  }
  @Watch('comparison')
  comparisonWatcher() {
    this.reDraw();
  }
  @Watch('continentMap')
  continentWatcher() {
    this.reDraw();
  }
  @Watch('sportsMap')
  sportsWatcher() {
    this.reDraw();
  }
  @Watch('legend')
  legendWatcher() {
    this.reDraw();
  }

  created() {
    window.addEventListener('resize', this.resizedEvent);
  }
  destroyed() {
    window.removeEventListener('resize', this.resizedEvent);
  }

  resizedEvent(e: Event) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (!this.isSmall && w <= 768) {
      this.isSmall = true;
      this.resized();
    }
    if (this.isSmall && w > 768) {
      this.isSmall = false;
      this.resized();
    }
  }
  // Below this point it's all D3 stuff.
  // Proceed at your own risk
  // Pray for @johnnystrachan who had to slave over this for over a week

  async draw() {
    const container = d3
      .select('#parallel-focus')
      .append('svg')
      .attr('id', 'container-svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.container = container;
    const height = this.getHeight;
    const width = this.getWidth;
    const margin = this.margin;
    const that = this;
    const lines: { [key: string]: { focus: number; rest: number } } = {
      age: { focus: this.focus.age!, rest: this.comparison.age ?? -50 },
      height: { focus: this.focus.height!, rest: this.comparison.height ?? -50 },
      weight: { focus: this.focus.weight!, rest: this.comparison.weight ?? -50 },
      'Number of medals': { focus: this.focus.medals!, rest: this.comparison.medals ?? -50 },
    };

    const keys = Object.keys(lines);

    keys.forEach((k: string) => {
      const max = this.limits[k].max;
      const min = this.limits[k].min;
      const arr = [min - 5, max + 5];

      that.y[k] = d3
        .scaleLinear()
        //@ts-ignore
        .domain(d3.extent(arr))
        .range([height - 20, 5]);
    });

    that.x = d3.scalePoint().range([0, width]).padding(1).domain(keys);

    const athleteLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      athleteLine.push([that.x!(key)!, that.y[key](lines[key].focus)]);
    });
    const restLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      restLine.push([that.x!(key)!, that.y[key](lines[key].rest)]);
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
        return 'translate(' + that.x!(d) + ')';
      })
      // And I build the axis with the call function
      .each(function (d) {
        d3.select(this).call(d3.axisLeft(that.y[d]));
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
      .text(this.legend)
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
    const height = this.height;
    const width = this.width;
    const margin = this.margin;

    //get data again
    const lines: { [key: string]: { focus: number; rest: number } } = {
      age: { focus: this.focus.age!, rest: this.comparison.age ?? -50 },
      height: { focus: this.focus.height!, rest: this.comparison.height ?? -50 },
      weight: { focus: this.focus.weight!, rest: this.comparison.weight ?? -50 },
      'Number of medals': { focus: this.focus.medals!, rest: this.comparison.medals ?? -50 },
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
      athleteLine.push([x(key)!, y[key](lines[key].focus)]);
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

  resized() {
    d3.select('#parallel-focus').selectAll('*').remove();
    const height = window.innerHeight * this.heightRatio;
    const width = window.innerWidth * this.widthRatio;
    const container = d3
      .select('#parallel-focus')
      .append('svg')
      .attr('id', 'container-svg')
      .attr('width', width)
      .attr('height', height);
    this.container = container;

    const margin = this.margin;

    const that = this;
    const lines: { [key: string]: { focus: number; rest: number } } = {
      age: { focus: this.focus.age!, rest: this.comparison.age ?? -50 },
      height: { focus: this.focus.height!, rest: this.comparison.height ?? -50 },
      weight: { focus: this.focus.weight!, rest: this.comparison.weight ?? -50 },
      'Number of medals': { focus: this.focus.medals!, rest: this.comparison.medals ?? -50 },
    };

    const keys = Object.keys(lines);

    keys.forEach((k: string) => {
      const max = this.limits[k].max;
      const min = this.limits[k].min;
      const arr = [min - 5, max + 5];

      that.y[k] = d3
        .scaleLinear()
        //@ts-ignore
        .domain(d3.extent(arr))
        .range([height - 20, 5]);
    });

    that.x = d3.scalePoint().range([0, width]).padding(1).domain(keys);

    const athleteLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      athleteLine.push([that.x!(key)!, that.y[key](lines[key].focus)]);
    });
    const restLine: [number, number][] = [];
    Object.keys(lines).forEach((key) => {
      restLine.push([that.x!(key)!, that.y[key](lines[key].rest)]);
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
        return 'translate(' + that.x!(d) + ')';
      })
      // And I build the axis with the call function
      .each(function (d) {
        d3.select(this).call(d3.axisLeft(that.y[d]));
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
      .attr('cy', height / 2)
      .attr('r', 6)

      .style('fill', '#69b3a2');
    container
      .append('circle')
      .attr('r', 6)
      .attr('cy', height / 2 + 20)
      .attr('cx', 10)
      .style('fill', '#404080');
    container
      .append('text')
      .text(this.legend)
      .attr('y', height / 2)
      .attr('x', 20)
      .style('font-size', '15px')
      .attr('alignment-baseline', 'middle');
    container
      .append('text')
      .attr('y', height / 2 + 20)
      .attr('x', 20)
      .text('Average Stats')
      .style('font-size', '15px')
      .attr('alignment-baseline', 'middle');
  }
}
</script>


<style lang="scss">
.vs__dropdown-menu {
  max-height: 250px;
}
#parallel-focus {
  margin: 10px;
  justify-content: center;
  // overflow-x: auto;
}
.wrapper {
  max-width: 90vw;
  display: grid;
  grid-template-columns: 4fr 3fr;
  @media only screen and (max-width: 1200px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
}
.dropdowns {
  max-width: 350px;
  min-width: 250px;
  margin-bottom: 20px;
  .dropdown {
    .vs__dropdown-toggle {
      cursor: pointer;
    }
  }
}
</style>