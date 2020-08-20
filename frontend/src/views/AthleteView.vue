<template lang="pug">
.home
  .title
    h3 Michael Fred Phelps II
  .charts
    .one
      InfoBox
    .two
      MedalsAtAge
    .three
      ParallelChart
    .four
      News
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InfoBox from '@/components/InfoBox.vue';
import News from '@/components/News.vue';
import MedalsAtAge from '@/components/MedalsAtAge.vue';
import ParallelChart from '@/components/ParallelChart.vue';
@Component({ components: { InfoBox, News, MedalsAtAge, ParallelChart } })
export default class AthleteView extends Vue {}
</script>


<style lang="scss" scoped>
.home {
  padding: 12px 50px 60px 50px;
  .title {
    h3 {
      font-size: 26px;
      color: var(--violet);
      font-weight: normal;
      margin-bottom: 25px;
    }
  }
  .charts {
    display: grid;
    grid-template-columns: 0.4fr 0.6fr 1fr;
    grid-gap: 25px;
    
    >div {
      background: white;
      padding: 14px 20px;
      box-shadow: 9px 8px 10px #00000017;
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

</style>