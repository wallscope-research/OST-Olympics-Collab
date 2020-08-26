<template lang="pug">
.home
  .title-page
    icon(:icon="['fas', 'globe-europe']")
    h3 Europe
  .charts
    .one
      InfoBox
    .two

    .three
      
    .four
      News
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InfoBox from '@/components/InfoBox.vue';
import News from '@/components/News.vue';
@Component({ components: { InfoBox, News } })
export default class ContinentView extends Vue {}
</script>


<style lang="scss" scoped>

@media only screen and (max-width: 768px ) {
  .home {
    .charts {
      grid-template-columns: 1fr;
    }
  }
}
@media only screen and (min-width:769px) and (max-width:1300px){
  .home {
    .charts { grid-template-columns: 1fr; }
  }
}
@media only screen and (min-width: 1301px) {
  .home {
    .charts {
      grid-template-columns: 0.4fr 0.6fr 1fr;
      >div {
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