<template lang="pug">
.home
  .title-page
    icon(:icon='["fas", "globe-europe"]')
    h3 Europe
  .charts
    .one
      InfoBox
    .two
      MultipleLines(:propOptions='getOptions', :title='title')
    .three
      ContinentParallelChart
    .four
      h2.chart-title News
      //- Article(v-for='a in articles', :article="a", @tag-clicked="navigate")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InfoBox from '@/components/InfoBox.vue';
import Article from '@/components/Article.vue';
import MultipleLines from '@/components/MultipleLines.vue';
import ContinentParallelChart from '@/components/ContinentParallelChart.vue';
@Component({ components: { InfoBox, Article, MultipleLines, ContinentParallelChart } })
export default class ContinentView extends Vue {
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

  title = 'Number of athletes vs number of medals won';
  get getOptions() {
    const data = Object.keys(this.medals);
    const series = [];
    series.push({
      name: 'Number of athletes',
      data: Object.values(this.medals).map((x) => x.numOfAtheltes),
      type: 'line',
    });
    series.push({
      name: 'Number of meals awarded',
      data: Object.values(this.medals).map((x) => x.numOfMedals),
      type: 'line',
    });
    return { data, series };
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