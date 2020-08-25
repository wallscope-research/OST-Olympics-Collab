<template lang="pug">
.home
  .title-page
    OlympicTorch(
      icon-width = 26
      icon-height = 36
    )
    h3 Swimming
  .charts
    .one
      InfoBox
    .two
      TopFemaleAthlets
    .three
      TopMaleAthlets
    .four
      News
    .five
      
    .six
      
    .seven
      
    .eight
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InfoBox from '@/components/InfoBox.vue';
import News from '@/components/News.vue';
import TopMaleAthlets from '@/components/TopMaleAthlets.vue';
import TopFemaleAthlets from '@/components/TopFemaleAthlets.vue';
import OlympicTorch from '@/components/OlympicTorch.vue'
@Component({ components: { InfoBox, News, TopFemaleAthlets, TopMaleAthlets, OlympicTorch} })
export default class SportView extends Vue {}
</script>


<style lang="scss" scoped>
@media only screen and (max-width: 768px ) {
  .home {
    .charts {
      grid-template-columns: 1fr;
      >div {
        &.four {
          grid-row: 8/9;
        }
      }
    }
  }
}
@media only screen and (min-width:769px) and (max-width:1300px){
  .home {
    .charts {
      grid-template-columns: 1fr 1fr;
      >div {
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
      grid-template-columns: 0.5fr 0.20fr 0.20fr 0.5fr 1fr;
      grid-template-rows: repeat(4, 1fr);
      >div {
        &.two {
          grid-column: 2/4;
        }
        &.four {
          grid-row: 1/5;
          grid-column: 5/6;
        }
        &.five{
          grid-column: 1/3;
          grid-row: 2/5;
        }
        &.six, &.seven, &.eight {
          grid-column: 3/5;
        }
      }
    }
  }
}

</style>