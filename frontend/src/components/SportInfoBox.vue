<template lang="pug">
div
  h2.chart-title Sport Info
  p Number of Athletes: {{ athletes }}
  p Medals won: {{ medals }}
  .sport
    p Season:
    Tag(:text='season')
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue';
import { Sport } from '@/store';

@Component({ components: { Tag } })
export default class SportInfoBox extends Vue {
  @Prop({ required: true }) season!: string;
  @Prop({ required: true }) athletes!: number;
  @Prop({ required: true }) medals!: number;
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