<template lang="pug">
.home
  .title-page
    icon(:icon='["fas", "globe-europe"]')
    h3(v-if='continentName') {{ continentName }}
    h3(v-else) Loading...
  .charts
    .one(v-if='info')
      ContinentInfoBox(
        :medals='continentMedals',
        :teams='continentTeams',
        :athletes='continentAthletes'
      )
    .two(v-if='continentAverages && averages && medalsVAthletes')
      MultipleLines(
        :propOptions='getOptions',
        title='Number of Medals and Athletes over time',
        :sportsMap='sports',
        @line-sport-selected='lineSportSelected'
      )
    .three(v-if='continentAverages && averages')
      ParallelChart(
        :legend='continentName + " Stats"',
        :focus='continentAverages',
        :comparison='averages',
        :continentMap='continents',
        :sportsMap='sports',
        @continent-selected='continentSelected',
        @sport-selected='sportSelected',
        @gender-selected='genderSelected'
      )
    .four
      h2.chart-title News
      Article(:key='a.text', v-for='a in articles', :article='a', @tag-clicked='navigate')
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ContinentInfoBox from '@/components/ContinentInfoBox.vue';
import Article from '@/components/Article.vue';
import MultipleLines from '@/components/MultipleLines.vue';
import ParallelChart from '@/components/ParallelChart.vue';
import continentsM from '@/store/continentsM';
import sportsM from '@/store/sportsM';
import { Averages, DataArticle } from '@/store';

@Component({ components: { ContinentInfoBox, Article, MultipleLines, ParallelChart } })
export default class ContinentView extends Vue {
  @Prop({ required: false }) readonly continentID: string | undefined;
  medals = {
    2000: { numOfAtheltes: 1358, numOfMedals: 416 },
    2002: { numOfAtheltes: 1437, numOfMedals: 527 },
    2004: { numOfAtheltes: 1673, numOfMedals: 558 },
    2006: { numOfAtheltes: 1622, numOfMedals: 582 },
    2008: { numOfAtheltes: 1469, numOfMedals: 504 },
    1998: { numOfAtheltes: 1232, numOfMedals: 463 },
    2010: { numOfAtheltes: 1398, numOfMedals: 448 },
    2012: { numOfAtheltes: 1442, numOfMedals: 315 },
    2014: { numOfAtheltes: 1565, numOfMedals: 387 },
    2016: { numOfAtheltes: 1577, numOfMedals: 428 },
    2018: { numOfAtheltes: 1622, numOfMedals: 489 },
  };
  continentAverages: Averages | null = null;
  continentName = continentsM.continentName;
  averages: Averages | null = null;
  articles: DataArticle[] | null = null;
  continents = continentsM.continents;
  sports = sportsM.sports;
  selectedContinent: string | undefined;
  selectedSport: string | undefined;
  lineSelectedSport: string | undefined;
  selectedGender: string | undefined;
  info: {
    medals: number;
    teams: number;
    athletes: number;
  } | null = null;
  medalsVAthletes: {
    [key: string]: {
      athletes: number;
      medals: number;
    };
  } | null = null;

  @Watch('continentID')
  async athleteChanged(val: string) {
    this.selectedContinent = undefined;
    this.selectedSport = undefined;
    this.selectedGender = undefined;
    continentsM.setContinent(`http://dbpedia.org/resource/${this.continentID}`);
    await this.fetchOptions();
    this.continentName = continentsM.continentName;
    await this.fetchNews();
    await this.fetchContinentAverages();
    await this.fetchAverages();
  }

  title = 'Number of athletes vs number of medals won';
  get getOptions() {
    const data = Object.keys(this.medalsVAthletes!);
    const series = [];
    series.push({
      name: 'Number of athletes',
      data: Object.values(this.medalsVAthletes!).map((x) => {
        return x.athletes;
      }),
      type: 'line',
    });
    series.push({
      name: 'Number of medals won',
      data: Object.values(this.medalsVAthletes!).map((x) => {
        return x.medals;
      }),
      type: 'line',
    });
    return { data, series };
    // const data = Object.keys(this.medals);
    // const series = [];
    // series.push({
    //   name: 'Number of athletes',
    //   data: Object.values(this.medals).map((x) => x.numOfAtheltes),
    //   type: 'line',
    // });
    // series.push({
    //   name: 'Number of meals awarded',
    //   data: Object.values(this.medals).map((x) => x.numOfMedals),
    //   type: 'line',
    // });
    // return { data, series };
  }

  get continentMedals() {
    return this.info!.medals;
  }
  get continentAthletes() {
    return this.info!.athletes;
  }
  get continentTeams() {
    return this.info!.teams;
  }

  sportSelected(uri: string) {
    this.selectedSport = uri;
    this.fetchAverages();
  }

  lineSportSelected(uri: string) {
    this.lineSelectedSport = uri;
    this.fetchMedalsVAthletes();
  }

  continentSelected(uri: string) {
    this.selectedContinent = uri;
    this.fetchAverages();
  }

  genderSelected(uri: string) {
    this.selectedGender = uri;
    this.fetchAverages();
  }

  async fetchMedalsVAthletes() {
    await continentsM.fetchMedalsVAthletes({ sport: this.lineSelectedSport });
    this.medalsVAthletes = continentsM.getMedalsVAthletes;
  }

  async fetchContinentAverages() {
    await continentsM.fetchAverageStats({
      continent: continentsM.continentURI,
    });
    this.continentAverages = continentsM.getAverateStats;
  }

  async fetchContinentInfo() {
    await continentsM.fetchContinentInfo({ name: this.continentID! });
    this.info = continentsM.getContinentInfo;
  }

  async fetchAverages() {
    await continentsM.fetchAverageStats({
      sport: this.selectedSport,
      continent: this.selectedContinent,
      gender: this.selectedGender,
    });
    this.averages = continentsM.getAverateStats;
  }

  async fetchOptions() {
    await Promise.all([continentsM.fetchContinents(), sportsM.fetchSports()]);
    this.continents = continentsM.continents;
    this.sports = sportsM.sports;
  }

  async fetchNews() {
    await continentsM.fetchContinentArticles();
    this.articles = continentsM.getArticles;
  }

  navigate(uri: string) {
    this.$router.push(uri.replace('http://wallscope.co.uk/resource/olympics', ''));
  }

  async mounted() {
    continentsM.setContinent(`http://dbpedia.org/resource/${this.continentID}`);
    await this.fetchOptions();
    this.continentName = continentsM.continentName;
    await this.fetchNews();
    await this.fetchContinentAverages();
    await this.fetchAverages();
    await this.fetchContinentInfo();
    await this.fetchMedalsVAthletes();
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
    }
  }
}
@media only screen and (min-width: 769px) and (max-width: 1300px) {
  .home {
    .charts {
      grid-template-columns: 1fr;
    }
  }
}
@media only screen and (min-width: 1301px) {
  .home {
    .charts {
      grid-template-columns: 0.6fr 0.8fr 0.8fr;
      > div {
        &.four {
          grid-row: 1/3;
          grid-column: 3/4;
        }
        &.three {
          grid-column: 1/3;
        }
      }
    }
  }
}
</style>