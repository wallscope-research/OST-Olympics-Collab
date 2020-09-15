<template lang="pug">
div
  h2.chart-title Athlete Info
  p Age: {{ age }}
  p Medals: {{ medals }}
  .sport
    p Sport:
    Tag(:text='sport.name')
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue';
import { Sport } from '@/store/sportsM';

@Component({ components: { Tag } })
export default class InfoBox extends Vue {
  @Prop({ default: 'None Provided' }) age!: number;
  @Prop() medals!: number;
  @Prop({
    default: function () {
      return new Sport('None specified');
    },
  })
  sport!: Sport;
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
}
</style>