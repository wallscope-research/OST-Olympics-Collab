<template lang="pug">
#searchBar
  p search
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
    padding: 20px 30px;
  }
</style>