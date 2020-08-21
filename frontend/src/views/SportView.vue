<template lang="pug">
.home
  .title-page
    icon(:icon="['fas', 'user']")
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
@Component({ components: { InfoBox, News, TopFemaleAthlets, TopMaleAthlets } })
export default class SportView extends Vue {}
</script>


<style lang="scss" scoped>
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

</style>