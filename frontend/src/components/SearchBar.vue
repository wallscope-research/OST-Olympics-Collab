<template lang="pug">
#searchBar
  div
    p search input
  div
    div
      p You can search for:
    div
      .termType
        p continent
      .termType
        p sport discipline
      .termType
        p player's name
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SearchBar extends Vue {}
</script>

<style lang="scss">
  #searchBar {
    background: var(--grey-search-bar);
    box-shadow: 9px 8px 10px #00000017;
    min-height: 50px;
    padding: 20px 10px 30px 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap:15px;
    > div {
      &:nth-child(2){
        > div {
          &:nth-child(1){
            p {
              font-size: 13px;
            }
          }
          &:nth-child(2){
            display: grid;
            grid-template-columns: 1fr  1.5fr 120px;
            .termType{
              display: flex;
              align-items: center;
              svg {
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
</style>