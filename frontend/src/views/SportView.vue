<template lang="pug">
.home
  .title-page
    OlympicTorch(icon-width=26, icon-height=36)
    h3 {{ sportID }}
  .charts
    .one(v-if='sport')
      .about-area
        AboutPopup(
          :desc='getSportsContent.infoBox.description',
          :how='getSportsContent.infoBox.source',
          :links='getSportsContent.infoBox.links'
        )
      SportInfoBox(
        :season='season',
        :medals='medalCount',
        :athletes='athleteCount',
        :eventCount='events'
      )
    .two
      .about-area
        AboutPopup(
          :desc='getSportsContent.topFemales.description',
          :how='getSportsContent.topFemales.source'
        )
      TopAthletes(title='Top Female Athletes', :athletes='topFemale', @tag-clicked='navigate')
    .three
      .about-area
        AboutPopup(
          :desc='getSportsContent.topMale.description',
          :how='getSportsContent.topMale.source'
        )
      TopAthletes(title='Top Male Athletes', :athletes='topMale', @tag-clicked='navigate')
    .four(v-if='articles && articles.length > 0')
      .about-area
        AboutPopup(:desc='getAllContent.news.description', :how='getAllContent.news.source')
      h2.chart-title News
      Article(:key='a.text', v-for='a in articles', :article='a', @tag-clicked='navigate')
    .four(v-else-if='articles != null && articles.length < 1')
      h2.chart-title News
      p No articles to display about {{ sport.name }}
    .four(v-else)
      h2.chart-title News
      p Loading...
    .five(v-if='sportsOverTime && Object.keys(sportsOverTime).length > 0')
      .about-area
        AboutPopup(
          :desc='getSportsContent.medalsPerContinent.description',
          :how='getSportsContent.medalsPerContinent.source'
        )
      SportsBar(:overTime='overTime', :axisMax='axisMax')
      p Pick a year
      vue-slider(v-model='date', :data='years')
    .six(v-if='averages && Object.keys(averages).length > 0')
      .about-area
        AboutPopup(
          :desc='getSportsContent.ageOverTime.description',
          :how='getSportsContent.ageOverTime.source'
        )
      MultipleLines(:propOptions='ageTime', :title='ageTitle', :min='ageMin', :max='ageMax')
    .seven(v-if='averages && Object.keys(averages).length > 0')
      .about-area
        AboutPopup(
          :desc='getSportsContent.heightOverTime.description',
          :how='getSportsContent.heightOverTime.source'
        )
      MultipleLines(
        :propOptions='heightTime',
        :title='heightTitle',
        :max='heightMax',
        :min='heightMin'
      )
    .eight(v-if='averages && Object.keys(averages).length > 0')
      .about-area
        AboutPopup(
          :desc='getSportsContent.weightOverTime.description',
          :how='getSportsContent.weightOverTime.source'
        )
      MultipleLines(
        :propOptions='weightTime',
        :title='weightTitle',
        :max='weightMax',
        :min='weightMin'
      )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import SportInfoBox from '@/components/SportInfoBox.vue';
import Article from '@/components/Article.vue';
import AboutPopup from '@/components/AboutPopup.vue';
import TopAthletes from '@/components/TopAthletes.vue';
import OlympicTorch from '@/components/OlympicTorch.vue';
import MultipleLines from '@/components/MultipleLines.vue';
import SportsBar from '@/components/SportsBar.vue';
import { curveMonotoneX } from 'd3';
import { Athlete, DataArticle, Sport, Averages } from '@/store/index';
import athleteM from '@/store/athletesM';
import sportsM, { DataSportYear, defaultDataSportYear } from '@/store/sportsM';
import { continentMap } from '@/store/continentsM';
import { sportTexts, allTexts } from '@/utils/aboutTexts';
@Component({
  components: {
    SportInfoBox,
    'vue-slider': VueSlider,
    Article,
    TopAthletes,
    OlympicTorch,
    MultipleLines,
    SportsBar,
    AboutPopup,
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
  averages: { [year: string]: { female: Averages; male: Averages } } = {};
  sportsOverTime: { [year: string]: DataSportYear } = {};
  years: string[] = [];
  ageMax: number = 0;
  ageMin: number = 0;
  weightMin: number = 0;
  weightMax: number = 0;
  heightMin: number = 0;
  heightMax: number = 0;
  fetchErrored = false;

  get getSportsContent() {
    return sportTexts;
  }

  get getAllContent() {
    return allTexts;
  }
  get ageTime() {
    if (!this.averages) return {};
    return {
      data: Object.keys(this.averages),
      series: [
        {
          name: 'Male average age',
          data: Object.values(this.averages).map((x) => x?.male?.age ?? 0),
          type: 'line',
        },
        {
          name: 'Female average age',
          data: Object.values(this.averages).map((x) => x?.female?.age ?? 0),
          type: 'line',
        },
      ],
    };
  }

  get overTime() {
    if (!this.barYear) return [];
    return Object.keys(this.barYear).map((x) => {
      return {
        name: x,
        type: 'bar',
        // @ts-ignore
        data: [this.barYear[x].medalCount, this.barYear[x].athleteCount],
      };
    });
  }

  get heightTime() {
    if (!this.averages) return {};
    return {
      data: Object.keys(this.averages),
      series: [
        {
          name: 'Male average height (cm)',
          data: Object.values(this.averages).map((x) => x?.male?.height ?? 0),
          type: 'line',
        },
        {
          name: 'Female average height (cm)',
          data: Object.values(this.averages).map((x) => x?.female?.height ?? 0),
          type: 'line',
        },
      ],
    };
  }

  get weightTime() {
    if (!this.averages) return {};
    return {
      data: Object.keys(this.averages),
      series: [
        {
          name: 'Male average weight (cm)',
          data: Object.values(this.averages).map((x) => x?.male?.weight ?? 0),
          type: 'line',
        },
        {
          name: 'Female average weight (cm)',
          data: Object.values(this.averages).map((x) => x?.female?.weight ?? 0),
          type: 'line',
        },
      ],
    };
  }

  get athleteCount() {
    return this.sport?.athleteCount ?? 0;
  }
  get medalCount() {
    return this.sport?.medalCount ?? 0;
  }
  get season() {
    return this.sport?.season ?? 'None specified';
  }

  get events() {
    return this.sport?.eventCount ?? 0;
  }

  navigate(uri: string) {
    if (uri.indexOf('dbpedia.org') > -1) {
      this.$router.push(uri.replace('http://dbpedia.org/resource/', '/continent/'));
      return;
    }
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
    Vue.nextTick(async () => {
      await this.fetchNews();
    });
  }

  get barYear() {
    return this.sportsOverTime?.[this.date] || defaultDataSportYear(); // default should actually never happen unless you manually mess with the years
  }

  get axisMax() {
    const medals = Object.values(this.barYear).map((x) => {
      return x.medalCount;
    });
    const athletes = Object.values(this.barYear).map((x) => {
      return x.athleteCount;
    });
    return Math.ceil(Math.max(...medals, ...athletes) / 50) * 50;
  }

  async fetchSportAverages() {
    this.averages = {};
    await sportsM.fetchSportAverages({
      sport: `http://wallscope.co.uk/resource/olympics/sport/${this.sportID}`,
    });
    let minAge = 100,
      maxAge = 0;
    let minWeight = 100,
      maxWeight = 0;
    let minHeight = 200,
      maxHeight = 0;
    this.averages = sportsM.getSportAverages;
    Object.values(this.averages).forEach((avg) => {
      if (avg.male.age! > maxAge) maxAge = avg.male.age!;
      else if (avg.male.age! < minAge) minAge = avg.male.age!;
      if (avg.male.weight! > maxWeight) maxWeight = avg.male.weight!;
      else if (avg.male.weight! < minWeight) minWeight = avg.male.weight!;
      if (avg.male.height! > maxHeight) maxHeight = avg.male.height!;
      else if (avg.male.height! < minHeight) minHeight = avg.male.height!;
      if (avg.male.age! > maxAge) maxAge = avg.male.age!;
      else if (avg.female.age! < minAge) minAge = avg.female.age!;
      if (avg.female.weight! > maxWeight) maxWeight = avg.female.weight!;
      else if (avg.female.weight! < minWeight) minWeight = avg.female.weight!;
      if (avg.female.height! > maxHeight) maxHeight = avg.female.height!;
      else if (avg.female.height! < minHeight) minHeight = avg.female.height!;
    });
    this.ageMax = maxAge;
    this.ageMin = minAge;
    this.weightMax = maxWeight;
    this.weightMin = minWeight;
    this.heightMax = maxHeight;
    this.heightMin = minHeight;
  }

  async fetchSportInfo() {
    await sportsM.fetchSportInfo({
      sport: `<http://wallscope.co.uk/resource/olympics/sport/${this.sportID}>`,
      name: this.sportID,
    });
    this.sport = sportsM.getSport;
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
    this.years = Object.keys(this.sportsOverTime).sort((a, b) => Number(a) - Number(b));
    this.date = this.years[0];
  }

  @Watch('fetchErrored')
  errorChanged() {
    if (this.fetchErrored) {
      // alert(message, title, type)
      this.$alert(
        'Missing information for this athlete. Please search for something else',
        '',
        'warning'
      ).then(() => {
        this.fetchErrored = false;
        this.$router.push('/');
      });
    }
  }

  async mounted() {
    try {
      await Promise.all([
        this.fetchTopAthletes(),
        this.fetchSportInfo(),
        this.fetchSportAverages(),
        this.fetchSportsOverTime(),
      ]);
      Vue.nextTick(async () => {
        await this.fetchNews();
      });
    } catch (e) {
      this.fetchErrored = true;
    }
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