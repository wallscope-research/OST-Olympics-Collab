<template lang="pug">
    back-to-top( back-to-top bottom="50vh" right="0" visibleoffset="60")
      .arrow-container
          icon(:icon="['fas','chevron-double-up']")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ArrowUp extends Vue {}
</script>

<style lang="scss" scoped>
.vue-back-to-top {
  width: 40px;
  height: 50px;
}
.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  // margin-left: calc(100vw - 55px);
  // margin-top: 50vh;
  background: var(--active-color);
  box-shadow: -2px 2px 4px 1px #00000047;
  width: 40px;
  height: 50px;
  z-index: 9;
  svg {
    color: white;
    font-size: 18px;
  }
  @media only screen and (min-width: 1301px ) {
    display: none;
  }
}

</style>