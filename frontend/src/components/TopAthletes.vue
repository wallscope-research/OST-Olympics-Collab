<template lang="pug">
div
  h2.chart-title {{ title }}
  .athletsList
    .athlete(v-for='a in athletes')
      Tag(:key='a.uri', :text='a.name', @click='$emit("tag-clicked", a.uri)')
      .medals
        p.gold-count {{ getMedals[a.uri].gold }}
        p.silver-count {{ getMedals[a.uri].silver }}
        p.bronze-count {{ getMedals[a.uri].bronze }}
        icon.gold-medal(:icon='["fas", "medal"]', size='lg', color='#ffd700')
        icon.silver-medal(:icon='["fas", "medal"]', size='lg', color='#c0c0c0')
        icon.bronze-medal(:icon='["fas", "medal"]', size='lg', color='#cd7f32')
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue';
import { Athlete } from '@/store/index';
import athleteM from '@/store/athletesM';

@Component({ components: { Tag } })
export default class TopAthletes extends Vue {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) athletes!: Athlete[];

  get getMedals() {
    return athleteM.getTopMedals;
  }
}
</script>


<style lang="scss">
.athlete {
  display: flex;
  // flex-direction: column;
}

.medals {
  display: grid;
  justify-content: center;
  align-content: center;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 0px 3px;
  margin-left: auto;
  grid-template-areas:
    'gold-medal silver-medal bronze-medal'
    'gold-count silver-count bronze-count';
  p {
    text-align: center;
  }
}
.gold-medal {
  grid-area: gold-medal;
}
.silver-medal {
  grid-area: silver-medal;
}
.bronze-medal {
  grid-area: bronze-medal;
}
.gold-count {
  grid-area: gold-count;
}
.silver-count {
  grid-area: silver-count;
}
.bronze-count {
  grid-area: bronze-count;
}
</style>