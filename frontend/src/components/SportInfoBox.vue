<template lang="pug">
div
  h2.chart-title Sport Info
  p Number of Athletes: {{ age }}
  p Medals won: {{ medals }}
  .sport
    p Season:
    Tag(:text='sport.season')
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue';
import { Sport } from '@/store';

@Component({ components: { Tag } })
export default class SportInfoBox extends Vue {
  @Prop({ default: 'None Provided' }) age!: number;
  @Prop() medals!: number;
  @Prop({
    default: function () {
      return new Sport('None specified', 'None specified');
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