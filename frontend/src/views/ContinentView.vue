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
    .four(v-if='articles && articles.length > 0')
      h2.chart-title News
      Article(:key='a.text', v-for='a in articles', :article='a', @tag-clicked='navigate')
    .four(v-else-if="articles != null && articles.length < 1")
      h2.chart-title News
      p No articles to display about {{ continentName }}
    .four(v-else)
      h2.chart-title News
      p Loading...
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
  async continentChanged(val: string) {
    this.selectedContinent = undefined;
    this.selectedSport = undefined;
    this.selectedGender = undefined;
    await continentsM.setContinent(`http://dbpedia.org/resource/${this.continentID}`);
    await this.fetchOptions();
    this.continentName = continentsM.continentName;
    await this.fetchAverages();
    await Promise.all([
      this.fetchNews(),
      this.fetchContinentAverages(),
      this.fetchContinentInfo(),
      this.fetchMedalsVAthletes(),
    ]);
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
    await continentsM.fetchContinentInfo();
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
    if (uri.indexOf('dbpedia.org') > -1) {
      this.$router.push(uri.replace('http://dbpedia.org/resource/', '/continent/'));
      return;
    }
    this.$router.push(uri.replace('http://wallscope.co.uk/resource/olympics', ''));
  }

  async mounted() {
    await continentsM.setContinent(`http://dbpedia.org/resource/${this.continentID}`);
    await this.fetchOptions();
    this.continentName = continentsM.continentName;
    await this.fetchAverages();
    await Promise.all([
      this.fetchNews(),
      this.fetchContinentAverages(),
      this.fetchContinentInfo(),
      this.fetchMedalsVAthletes(),
    ]);
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