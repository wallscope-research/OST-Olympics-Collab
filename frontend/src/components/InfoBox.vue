<template lang="pug">
div
  h2 Athlete Info
  h3 Age: {{ "age" }}
  h3 Medals: {{ "medals" }}
  h3 Sport: {{ "sport" }}
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class InfoBox extends Vue {}
</script>


<style lang="scss">
</style>