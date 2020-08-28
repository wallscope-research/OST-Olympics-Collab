<template lang="pug">
.home
  .title-page
    OlympicTorch(icon-width=26, icon-height=36)
    h3 Swimming
  .charts
    .one
      InfoBox
    .two
      TopFemaleAthletes
    .three
      TopMaleAthletes
    .four
      News
    .five
      SportsBar
    .six
      MultipleLines(:propOptions='ageTime', :title='ageTitle')
    .seven
      MultipleLines(:propOptions='heightTime', :title='heightTitle')
    .eight
      MultipleLines(:propOptions='weightTime', :title='weightTitle')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import InfoBox from '@/components/InfoBox.vue';
import News from '@/components/News.vue';
import TopMaleAthletes from '@/components/TopMaleAthletes.vue';
import TopFemaleAthletes from '@/components/TopFemaleAthletes.vue';
import OlympicTorch from '@/components/OlympicTorch.vue';
import MultipleLines from '@/components/MultipleLines.vue';
import SportsBar from '@/components/SportsBar.vue';
import { curveMonotoneX } from 'd3';
@Component({
  components: {
    InfoBox,
    News,
    TopFemaleAthletes,
    TopMaleAthletes,
    OlympicTorch,
    MultipleLines,
    SportsBar,
  },
})
export default class SportView extends Vue {
  str = '';
  overTime: {
    [key: string]: {
      mAge: number;
      mHeight: number;
      mWeight: number;
      fAge: number;
      fHeight: number;
      fWeight: number;
    };
  } = {
    '1998': { mAge: 36, mHeight: 168, mWeight: 86, fAge: 32, fHeight: 159, fWeight: 62 },
    '2000': { mAge: 35, mHeight: 169, mWeight: 85, fAge: 33, fHeight: 161, fWeight: 59 },
    '2002': { mAge: 36, mHeight: 174, mWeight: 82, fAge: 30, fHeight: 158, fWeight: 62 },
    '2004': { mAge: 34, mHeight: 177, mWeight: 79, fAge: 31, fHeight: 164, fWeight: 68 },
    '2006': { mAge: 30, mHeight: 182, mWeight: 78, fAge: 28, fHeight: 166, fWeight: 74 },
    '2008': { mAge: 29, mHeight: 184, mWeight: 80, fAge: 27, fHeight: 163, fWeight: 74 },
    '2010': { mAge: 26, mHeight: 180, mWeight: 74, fAge: 26, fHeight: 169, fWeight: 78 },
    '2012': { mAge: 27, mHeight: 186, mWeight: 72, fAge: 24, fHeight: 171, fWeight: 76 },
    '2014': { mAge: 29, mHeight: 192, mWeight: 66, fAge: 26, fHeight: 167, fWeight: 72 },
    '2016': { mAge: 25, mHeight: 194, mWeight: 71, fAge: 25, fHeight: 169, fWeight: 66 },
    '2018': { mAge: 24, mHeight: 195, mWeight: 76, fAge: 22, fHeight: 174, fWeight: 64 },
  };

  ageTitle = 'Average Age of Athletes Over Time';
  heightTitle = 'Average Height of Athletes Over Time';
  weightTitle = 'Average Weight of Athletes Over Time';
  get ageTime() {
    const data = Object.keys(this.overTime);
    const series = [];
    series.push({
      name: 'Male average age',
      data: Object.values(this.overTime).map((x) => x.mAge),
      type: 'line',
    });
    series.push({
      name: 'Female average ages',
      data: Object.values(this.overTime).map((x) => x.fAge),
      type: 'line',
    });
    console.log({ data, series });
    return { data, series };
  }

  get heightTime() {
    const data = Object.keys(this.overTime);
    const series = [];
    series.push({
      name: 'Male average height',
      data: Object.values(this.overTime).map((x) => x.mHeight),
      type: 'line',
    });
    series.push({
      name: 'Female average height',
      data: Object.values(this.overTime).map((x) => x.fHeight),
      type: 'line',
    });
    console.log({ data, series });
    return { data, series };
  }

  get weightTime() {
    const data = Object.keys(this.overTime);
    const series = [];
    series.push({
      name: 'Male average weight',
      data: Object.values(this.overTime).map((x) => x.mWeight),
      type: 'line',
    });
    series.push({
      name: 'Female average weight',
      data: Object.values(this.overTime).map((x) => x.fWeight),
      type: 'line',
    });
    console.log({ data, series });
    return { data, series };
  }
}
</script>


<style lang="scss" scoped>
@media only screen and (max-width: 768px) {
  .home {
    .charts {
      grid-template-columns: 1fr;
      > div {
        &.four {
          grid-row: 8/9;
        }
      }
    }
  }
}
@media only screen and (min-width: 769px) and (max-width: 1300px) {
  .home {
    .charts {
      grid-template-columns: 1fr 1fr;
      > div {
        grid-column: 1/3;
        &.two {
          grid-column: 1/2;
        }
        &.three {
          grid-column: 2/3;
        }
        &.four {
          grid-row: 7/8;
        }
      }
    }
  }
}
@media only screen and (min-width: 1301px) {
  .home {
    .charts {
      grid-template-columns: 0.5fr 0.2fr 0.2fr 0.5fr 0.5fr;
      grid-template-rows: auto 1fr 1fr;
      > div {
        &.two {
          grid-column: 2/4;
        }
        &.four {
          grid-row: 1/4;
          grid-column: 5/6;
        }
        &.five{
          grid-column: 1/3;
        }
        &.six {
          grid-column: 3/5;
          grid-row : 2/3;
        }
        &.seven {
          grid-column: 1/3;
        }
        &.eight {
          grid-column: 3/5;
        }
      }
    }
  }
}
</style>