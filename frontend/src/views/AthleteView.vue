<template lang="pug">
.home
  .title-page
    icon(:icon='["fas", "user"]')
    h3(v-if='athlete') {{ athlete.name }}
    h3(v-else) Loading...
  .charts
    .one(v-if='athlete')
      InfoBox(:age='athlete.age', :medals='athlete.medals', :sport='athlete.sport')
    .two
      MedalsAtAge
    .three(v-if='athlete && averages')
      AthleteParallelChart(
        :athlete='athlete',
        :averages='averages',
        :continentMap='continents',
        :sportsMap='sports'
      )
    .four(v-if='athlete')
      News(:param='athlete.name')
</template>

<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import InfoBox from '@/components/InfoBox.vue';
import News from '@/components/News.vue';
import MedalsAtAge from '@/components/MedalsAtAge.vue';
import AthleteParallelChart from '@/components/AthleteParallelChart.vue';
import athleteM, { Athlete, Averages } from '@/store/athletesM';
import continentsM, { continentMap } from '@/store/continentsM';
import sportsM, { sportsMap } from '@/store/sportsM';
import { api } from '@/utils/api';
import { makeURI } from '@/utils/hiccupConnector';
import axios from 'axios';

@Component({ components: { InfoBox, News, MedalsAtAge, AthleteParallelChart } })
export default class AthleteView extends Vue {
  @Prop({ required: false }) readonly athleteID: string | undefined;
  athlete: Athlete | null = null;
  averages: Averages | null = null;
  continents = continentMap;
  sports = sportsMap;
  selectedContinent: string | undefined;
  selectedSport: string | undefined;

  @Watch('athleteID')
  athleteChanged(val: string) {
    this.fetchAthlete();
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
    });
    this.averages = athleteM.getAverateStats;
  }
  async mounted() {
    await Promise.all([this.fetchAthlete(), this.fetchAverages()]);
  }
}
</script>


<style lang="scss" scoped>
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
      grid-template-columns: 0.4fr 0.6fr 1fr;
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