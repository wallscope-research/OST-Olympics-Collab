<template lang="pug">
div
  h2.chart-title Continent Info
  p Olympic Teams: {{ teams }}
  p Medals won: {{ medals }}
  p Number of ahtletes competing: {{ athletes }}
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue';
import { Sport } from '@/store';

@Component({ components: { Tag } })
export default class ContinentInfoBox extends Vue {
  @Prop({ required: true }) teams!: number;
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