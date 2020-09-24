<template lang="pug">
div
  h2.chart-title Athlete Info
  p Age: {{ athlete.age }}
  p Height: {{ athlete.height }} cm
  p Weight: {{ athlete.weight }} kg
  p Sex: {{ athlete.sex }}
  p Medals: {{ athlete.medals }}
  p Team: {{ athlete.team }}
  .sport
    p Sport:
    Tag(:text='sport.name', @click='$emit("tag-clicked", sport.uri)')
  .continent 
    p Continent:
    Tag(:text='getContinentName', @click='$emit("tag-clicked", athlete.continent)')
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue';
import { Athlete, Sport } from '@/store';
import { continentMap } from '@/store/continentsM';
@Component({ components: { Tag } })
export default class InfoBox extends Vue {
  @Prop({ required: true }) athlete!: Athlete;
  @Prop({
    default: function () {
      return new Sport('http://wallscope.co.uk/resource/', 'None specified');
    },
  })
  sport!: Sport;

  get getContinentName() {
    return continentMap[this.athlete.continent!];
  }
}
</script>


<style lang="scss">
p {
  line-height: 25px;
}
.sport {
  display: flex;
  align-items: center;
  p {
    margin-right: 5px;
  }
  .continent {
    display: flex;
    align-items: center;
    p {
      margin-right: 1px;
    }
  }
}
</style>