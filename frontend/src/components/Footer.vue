<template lang="pug">
  #footer
    p footer
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {}
</script>


<style lang="scss">
#footer {
  background: var(--violet);
  min-height: 100px;
  p {
    color: white;
  }
}
</style>