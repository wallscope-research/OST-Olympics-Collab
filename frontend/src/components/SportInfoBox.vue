<template lang="pug">
div
  h2.chart-title Sport Info
  p Number of Athletes: {{ athletes.toLocaleString() }}
  p Number of Events: {{ eventCount.toLocaleString() }}
  p Medals won: {{ medals.toLocaleString() }}

  .sport
    p Season: {{ season }}
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class SportInfoBox extends Vue {
  @Prop({ required: true }) season!: string;
  @Prop({ required: true }) athletes!: number;
  @Prop({ required: true }) medals!: number;
  @Prop({ required: true }) eventCount!: number;
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