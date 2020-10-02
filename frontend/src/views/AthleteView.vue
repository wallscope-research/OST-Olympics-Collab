<template lang="pug">
.home
  .title-page
    icon(:icon='["fas", "user"]')
    h3(v-if='athlete') {{ athlete.name }}
    h3(v-else) Loading...
  .charts
    .one(v-if='athlete')
      .about-area
        AboutPopup(
          :desc='getAthleteContent.infoBox.description',
          :how='getAthleteContent.infoBox.source',
          :links='getAthleteContent.infoBox.links'
        )
      InfoBox(:sport='athlete.sport', :athlete='athlete', @tag-clicked='navigate')
    .two(v-if='athlete')
      .about-area
        AboutPopup(
          :desc='getAthleteContent.medalsByAge.description',
          :how='getAthleteContent.medalsByAge.source'
        )
      MedalsAtAge(:averageMedalsPerAge='averageMedalsPerAge', :athleteAge='athlete.age')
    .three(v-if='athlete && averages')
      .about-area
        AboutPopup(
          :desc='getAthleteContent.statistics.description',
          :how='getAthleteContent.statistics.source'
        )
      .parallel
        ParallelChart(
          legend='Athlete Stats',
          :focus='avgFocus',
          :comparison='averages',
          :continentMap='continents',
          :sportsMap='sports',
          @continent-selected='continentSelected',
          @sport-selected='sportSelected',
          @gender-selected='genderSelected'
        )
    .four(v-if='articles && articles.length > 0')
      .about-area
        AboutPopup(:desc='getAllContent.news.description', :how='getAllContent.news.source')
      h2.chart-title News
      Article(:key='a.text', v-for='a in articles', :article='a', @tag-clicked='navigate')
    .four(v-else-if='articles != null && articles.length < 1')
      h2.chart-title News
      p No articles to display about {{ athlete.name }}
    .four(v-else)
      h2.chart-title News
      p Loading...
</template>

<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import InfoBox from '@/components/InfoBox.vue';
import Article from '@/components/Article.vue';
import MedalsAtAge from '@/components/MedalsAtAge.vue';
import ParallelChart from '@/components/ParallelChart.vue';
import AboutPopup from '@/components/AboutPopup.vue';
import athleteM from '@/store/athletesM';
import { Averages, Athlete } from '@/store';
import continentsM from '@/store/continentsM';
import sportsM from '@/store/sportsM';
import axios from 'axios';
import { DataArticle } from '@/store/index';
import { athleteTexts, allTexts } from '@/utils/aboutTexts';
@Component({ components: { InfoBox, Article, MedalsAtAge, ParallelChart, AboutPopup } })
export default class AthleteView extends Vue {
  @Prop({ required: false }) readonly athleteID: string | undefined;
  athlete: Athlete | null = null;
  averages: Averages | null = null;
  articles: DataArticle[] | null = null;
  continents = continentsM.continents;
  sports = sportsM.sports;
  selectedContinent: string | undefined;
  selectedSport: string | undefined;
  selectedGender: string | undefined;
  averageMedalsPerAge: { [key: number]: number } = {};
  infoText = 'testing with text';
  fetchErrored = false;

  get avgFocus() {
    return new Averages(
      this.athlete!.height,
      this.athlete!.weight,
      this.athlete!.medals,
      this.athlete!.age
    );
  }

  get getAthleteContent() {
    return athleteTexts;
  }

  get getAllContent() {
    return allTexts;
  }

  @Watch('athleteID')
  async athleteChanged(val: string) {
    this.selectedContinent = undefined;
    this.selectedSport = undefined;
    this.selectedGender = undefined;
    await Promise.all([this.fetchAthlete(), this.fetchAverages(), this.fetchMedalsAtAge()]);
    await this.fetchNews();
  }
  async fetchAthlete() {
    await athleteM.fetchAthleteInfo({
      uri: `http://wallscope.co.uk/resource/olympics/athlete/${this.athleteID}`,
    });
    this.athlete = athleteM.getAthlete;
  }
  async fetchAverages() {
    await athleteM.fetchAverageStats({
      sport: this.selectedSport,
      continent: this.selectedContinent,
      gender: this.selectedGender,
    });
    this.averages = athleteM.getAverateStats;
  }

  async fetchOptions() {
    await Promise.all([continentsM.fetchContinents(), sportsM.fetchSports()]);
    this.continents = continentsM.continents;
    this.sports = sportsM.sports;
  }

  sportSelected(uri: string) {
    this.selectedSport = uri;
    this.fetchAverages();
  }

  continentSelected(uri: string) {
    this.selectedContinent = uri;
    this.fetchAverages();
  }

  genderSelected(uri: string) {
    this.selectedGender = uri;
    this.fetchAverages();
  }

  async fetchMedalsAtAge() {
    await athleteM.fetchMedalsAtAge();
    this.averageMedalsPerAge = athleteM.getAverageMedalsPerAge;
  }

  async fetchNews() {
    await athleteM.fetchAthleteArticles();
    this.articles = athleteM.getArticles;
  }

  navigate(uri: string) {
    if (uri.indexOf('dbpedia.org') > -1) {
      this.$router.push(uri.replace('http://dbpedia.org/resource/', '/continent/'));
      return;
    }
    this.$router.push(uri.replace('http://wallscope.co.uk/resource/olympics', ''));
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
    console.log(window.history.length);
    try {
      await Promise.all([
        this.fetchOptions(),
        this.fetchAthlete(),
        this.fetchAverages(),
        this.fetchMedalsAtAge(),
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
  display: grid;
  grid-template-columns: 1fr;
  .parallel {
    overflow-x: auto;
  }
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