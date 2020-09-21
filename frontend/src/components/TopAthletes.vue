<template lang="pug">
div
  h2.chart-title {{ title }}
  .athletsList
    Tag(:key="a.uri", v-for='a in athletes', :text='a.name', @click='$emit("tag-clicked", a.uri)')
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue';
import { Athlete } from '@/store/index';

@Component({ components: { Tag } })
export default class TopAthletes extends Vue {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) athletes!: Athlete[];
}
</script>


<style lang="scss">
</style>