<template lang="pug">
.home
  .title-page
    OlympicTorch(icon-width=26, icon-height=36)
    h3 {{ sportID }}
  .charts
    .one(v-if='sport')
      SportInfoBox(:season='season', :medals='medalCount', :athletes='athleteCount')
    .two
      TopAthletes(title='Top Female Athletes', :athletes='topFemale', @tag-clicked='navigate')
    .three
      TopAthletes(title='Top Male Athletes', :athletes='topMale', @tag-clicked='navigate')
    .four(v-if='articles && articles.length > 0')
      h2.chart-title News
      Article(:key='a.text', v-for='a in articles', :article='a', @tag-clicked='navigate')
    .four(v-else-if='articles != null && articles.length < 1')
      h2.chart-title News
      p No articles to display about {{ sport.name }}
    .four(v-else)
      h2.chart-title News
      p Loading...
    .five(v-if='sportsOverTime && Object.keys(sportsOverTime).length > 0')
      SportsBar(:overTime='overTime', :axisMax='axisMax')
      p Pick a year
      vue-slider(v-model='date', :data='years')
    .six(v-if='averages && Object.keys(averages).length > 0')
      MultipleLines(:propOptions='ageTime', :title='ageTitle')
    .seven(v-if='averages && Object.keys(averages).length > 0')
      MultipleLines(:propOptions='heightTime', :title='heightTitle')
    .eight(v-if='averages && Object.keys(averages).length > 0')
      MultipleLines(:propOptions='weightTime', :title='weightTitle')
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import SportInfoBox from '@/components/SportInfoBox.vue';
import Article from '@/components/Article.vue';
import TopAthletes from '@/components/TopAthletes.vue';
import OlympicTorch from '@/components/OlympicTorch.vue';
import MultipleLines from '@/components/MultipleLines.vue';
import SportsBar from '@/components/SportsBar.vue';
import { curveMonotoneX } from 'd3';
import { Athlete, DataArticle, Sport, Averages } from '@/store/index';
import athleteM from '@/store/athletesM';
import sportsM, { DataSportYear, defaultDataSportYear } from '@/store/sportsM';
import { continentMap } from '@/store/continentsM';

@Component({
  components: {
    SportInfoBox,
    'vue-slider': VueSlider,
    Article,
    TopAthletes,
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
  date: string = '';
  averages: {
    [year: string]: {
      female: Averages;
      male: Averages;
    };
  } | null = null;
  sportsOverTime: { [year: string]: DataSportYear } | null = {};
  years: string[] = [];

  get ageTime() {
    return {
      data: Object.keys(this.averages!),
      series: [
        {
          name: 'Male average age',
          data: Object.values(this.averages!).map((x) => x.male.age),
          type: 'line',
        },
        {
          name: 'Female average age',
          data: Object.values(this.averages!).map((x) => x.female.age),
          type: 'line',
        },
      ],
    };
  }

  get overTime() {
    return Object.keys(this.barYear!).map((x) => {
      return {
        name: x,
        type: 'bar',
        // @ts-ignore
        data: [this.barYear![x].medalCount, this.barYear![x].athleteCount],
      };
    });
  }

  get heightTime() {
    return {
      data: Object.keys(this.averages!),
      series: [
        {
          name: 'Male average height (cm)',
          data: Object.values(this.averages!).map((x) => x.male.height),
          type: 'line',
        },
        {
          name: 'Female average height (cm)',
          data: Object.values(this.averages!).map((x) => x.female.height),
          type: 'line',
        },
      ],
    };
  }

  get weightTime() {
    return {
      data: Object.keys(this.averages!),
      series: [
        {
          name: 'Male average weight (cm)',
          data: Object.values(this.averages!).map((x) => x.male.weight),
          type: 'line',
        },
        {
          name: 'Female average weight (cm)',
          data: Object.values(this.averages!).map((x) => x.female.weight),
          type: 'line',
        },
      ],
    };
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
    this.$router.push(uri.replace('http://wallscope.co.uk/resource/olympics', ''));
  }
  @Watch('sportID')
  async sportChanged(val: string) {
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

  get barYear() {
    return this.sportsOverTime?.[this.date] || defaultDataSportYear() // default should actually never happen unless you manually mess with the years
  }

  get axisMax(){
    return sportsM.axisMax;
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
    this.years = Object.keys(this.sportsOverTime).sort((a,b) => Number(a) - Number(b));
    this.date = this.years[0];
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
          text-align: center;
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