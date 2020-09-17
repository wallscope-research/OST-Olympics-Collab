<template lang="pug">
.home
  .title-page
    OlympicTorch(icon-width=26, icon-height=36)
    h3 {{ sportID }}
  .charts
    .one(v-if='sport')
      SportInfoBox(:season='season', :medals='medalCount', :athletes='athleteCount')
    .two
      TopFemaleAthletes(:athletes='topFemale')
    .three
      TopMaleAthletes(:athletes='topMale')
    .four
      h2.chart-title News
      Article(:key='a.text', v-for='a in articles', :article='a', @tag-clicked='navigate')
    .five(v-if='sportsOverTime && Object.keys(sportsOverTime).length > 0')
      SportsBar(:overTime='sportsOverTime')
    .six(v-if='averages && Object.keys(averages).length > 0')
      MultipleLines(:propOptions='ageTime', :title='ageTitle')
    .seven(v-if='averages && Object.keys(averages).length > 0')
      MultipleLines(:propOptions='heightTime', :title='heightTitle')
    .eight(v-if='averages && Object.keys(averages).length > 0')
      MultipleLines(:propOptions='weightTime', :title='weightTitle')
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import SportInfoBox from '@/components/SportInfoBox.vue';
import Article from '@/components/Article.vue';
import TopMaleAthletes from '@/components/TopMaleAthletes.vue';
import TopFemaleAthletes from '@/components/TopFemaleAthletes.vue';
import OlympicTorch from '@/components/OlympicTorch.vue';
import MultipleLines from '@/components/MultipleLines.vue';
import SportsBar from '@/components/SportsBar.vue';
import { curveMonotoneX } from 'd3';
import { Athlete, DataArticle, Sport } from '@/store/index';
import athleteM from '@/store/athletesM';
import sportsM from '@/store/sportsM';
@Component({
  components: {
    SportInfoBox,
    Article,
    TopFemaleAthletes,
    TopMaleAthletes,
    OlympicTorch,
    MultipleLines,
    SportsBar,
  },
})
export default class SportView extends Vue {
  @Prop({ required: true }) sportID!: string;
  ageTitle = 'Average Age of Athletes Over Time';
  heightTitle = 'Average Height of Athletes Over Time';
  weightTitle = 'Average Weight of Athletes Over Time';
  topMale: Athlete[] = [];
  topFemale: Athlete[] = [];
  articles: DataArticle[] | null = null;
  sport: Sport | null = null;
  averages: {
    [key: string]: {
      female: { weight: number; age: number; height: number };
      male: { weight: number; age: number; height: number };
    };
  } | null = null;
  sportsOverTime: {
    [key: string]: {
      [key: string]: {
        medalCount: number;
        athleteCount: number;
      };
    };
  } | null = {};

  get ageTime() {
    const data = Object.keys(this.averages!);
    const series = [];

    series.push({
      name: 'Male average age',
      data: Object.values(this.averages!).map((x) => {
        return x.male.age;
      }),
      type: 'line',
    });
    series.push({
      name: 'Female average age',
      data: Object.values(this.averages!).map((x) => {
        return x.female.age;
      }),
      type: 'line',
    });
    return { data, series };
  }

  get heightTime() {
    const data = Object.keys(this.averages!);
    const series = [];
    series.push({
      name: 'Male average height (cm)',
      data: Object.values(this.averages!).map((x) => {
        return x.male.height;
      }),
      type: 'line',
    });
    series.push({
      name: 'Female average height (cm)',
      data: Object.values(this.averages!).map((x) => {
        return x.female.height;
      }),
      type: 'line',
    });
    return { data, series };
  }

  get weightTime() {
    const data = Object.keys(this.averages!);
    const series = [];
    series.push({
      name: 'Male average weight (kg)',
      data: Object.values(this.averages!).map((x) => {
        return x.male.weight;
      }),
      type: 'line',
    });
    series.push({
      name: 'Female average weight (kg)',
      data: Object.values(this.averages!).map((x) => {
        return x.female.weight;
      }),
      type: 'line',
    });
    return { data, series };
  }

  get athleteCount() {
    return this.sport!.athleteCount;
  }
  get medalCount() {
    return this.sport!.medalCount;
  }
  get season() {
    return this.sport!.season;
  }

  navigate(uri: string) {
    console.log('navigate');
  }
  @Watch('sportID')
  async athleteChanged(val: string) {
    // await Promise.all([this.fetchAthlete(), this.fetchAverages(), this.fetchMedalsAtAge()]);
    await this.fetchNews();
  }

  async fetchSportAverages() {
    await sportsM.fetchSportAverages({
      sport: `http://wallscope.co.uk/resource/olympics/sport/${this.sportID}`,
    });
    this.averages = sportsM.getSportAverages;
  }

  async fetchSportInfo() {
    await sportsM.fetchSportInfo({
      sport: `<http://wallscope.co.uk/resource/olympics/sport/${this.sportID}>`,
      name: this.sportID,
    });
    // this.medalCount
  }
  async fetchTopAthletes() {
    await athleteM.fetchTopAthletes({
      sport: `http://wallscope.co.uk/resource/olympics/sport/${this.sportID}`,
    });
    this.topMale = athleteM.getTopMaleAthletes;
    this.topFemale = athleteM.getTopFemaleAthletes;
  }

  async fetchNews() {
    await sportsM.fetchSportArticles();
    this.articles = sportsM.getArticles;
  }
  async fetchSportsOverTime() {
    await sportsM.fetchSportsOverTime({
      sport: `http://wallscope.co.uk/resource/olympics/sport/${this.sportID}`,
    });
    this.sportsOverTime = sportsM.getSportsOverTime;
  }

  async mounted() {
    await Promise.all([
      this.fetchTopAthletes(),
      this.fetchSportInfo(),
      this.fetchSportAverages(),
      this.fetchSportsOverTime(),
    ]);
    this.sport = sportsM.getSport;
    Vue.nextTick(async () => {
      await this.fetchNews();
    });
  }
}
</script>


<style lang="scss" scoped>
.three {
  overflow: auto;
}
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
        &.five {
          grid-column: 1/3;
        }
        &.six {
          grid-column: 3/5;
          grid-row: 2/3;
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