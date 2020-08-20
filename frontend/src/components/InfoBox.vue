<template lang="pug">
div
  h2.chart-title Athlete Info
  p Age: {{ "age" }}
  p Medals: {{ "medals" }}
  .sport
    p Sport: 
    Tag(
      tag-text='swimming'
    )
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue'

@Component({components: { Tag }})
export default class InfoBox extends Vue {}
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