<template lang="pug">
#topBar
  //- TODO: add Wallscope logo below
  p
  p OST Olympics Data Visualiser
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Navbar extends Vue {}
</script>


<style lang="scss">
#topBar {
  background: #367c91;
  padding-top: 10px;
  padding-bottom: 10px;
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-gap: 10px;
  align-items: center;
  p {
    font-size: 20px;
    font-weight: bold;
    color: white;
  }
}
</style>