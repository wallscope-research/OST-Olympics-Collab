<template lang="pug">
div
  h2.chart-title Top Female Athletes
  .athletsList
    Tag(:key="a.name", v-for='a in athletes', :text='a.name')
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue';
import { Athlete } from '@/store/index';

@Component({ components: { Tag } })
export default class TopFemaleAthletes extends Vue {
  @Prop({ required: true }) athletes!: Athlete[];
}
</script>


<style lang="scss">
</style>