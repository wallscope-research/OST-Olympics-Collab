<template lang="pug">
div
  h2.chart-title Top Male Athletes
  .athletsList
    Tag(v-for='a in athletes', :text='a.name')
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue';
import { Athlete } from '@/store/athletesM';

@Component({ components: { Tag } })
export default class TopMaleAthletes extends Vue {
  @Prop({ required: true }) athletes!: Athlete[];
}
</script>


<style lang="scss">
</style>