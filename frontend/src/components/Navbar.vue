<template lang="pug">
  #topBar
    .pageTitle
      p OST Olympics Data Visualiser
    .button
      p About
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';


@Component
export default class Navbar extends Vue {}
</script>


<style lang="scss">
#topBar {
  display: grid;
  grid-template-columns: 1fr auto;
  background: var(--violet);
  padding-top: 10px;
  padding-bottom: 10px;
  grid-gap: 10px;
  align-items: center;
  padding: 40px 50px 20px 50px;
  p {
    font-size: 22px;
    color: white;
  }
  > div {
    display: flex;
    &:nth-child(2) {
      justify-content: flex-end;
      p {
        font-size: 20px;
      }
    }
  }
  @media only screen and (max-width: 768px ) {
    padding: 20px 25px 20px 25px;
  }
}
</style>