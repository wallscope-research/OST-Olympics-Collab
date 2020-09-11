<template lang="pug">
.home
  .title-page
    icon(:icon='["fas", "user"]')
    h3 {{ athlete.name }}
  .charts
    .one
      InfoBox(:age='athlete.age', :medals='athlete.medals', :sport='athlete.sport')
    .two
      MedalsAtAge
    .three
      AthleteParallelChart(:athlete='athlete')
    .four
      News(:param='athlete.name')
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import InfoBox from '@/components/InfoBox.vue';
import News from '@/components/News.vue';
import MedalsAtAge from '@/components/MedalsAtAge.vue';
import AthleteParallelChart from '@/components/AthleteParallelChart.vue';
import athleteM, { Athlete } from '@/store/athletesM';
import { api } from '@/utils/api';
import { makeURI } from '@/utils/hiccupConnector';
import axios from 'axios';

@Component({ components: { InfoBox, News, MedalsAtAge, AthleteParallelChart } })
export default class AthleteView extends Vue {
  @Prop({ required: true }) athlete1!: string;
  uri = `http://wallscope.co.uk/resource/olympics/athlete/${this.athlete1}`;
  athlete: Athlete = { name: 'Pick a name' };
  info: any;
  async mounted() {
    if (this.athlete.name === 'Pick a name') {
      await athleteM.fetchAthleteInfo({
        uri: 'http://wallscope.co.uk/resource/olympics/athlete/JessicaPhyllisEnnisHill',
      });
      this.athlete = athleteM.getAthlete;
    }
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