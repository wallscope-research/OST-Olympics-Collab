<template lang="pug">
.container(:title='"search for " + text', @click.stop='$emit("click")')
  .tag
    p {{ text }}
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class TagC extends Vue {
  @Prop() text!: string;
}
</script>


<style lang="scss">
.container {
  // width: fit-content;
}
.tag {
  cursor: pointer;
  background: #f1f1f1;
  border-radius: 30px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  width: auto;
  &:hover {
    background: var(--active-color);
    p {
      color: white;
    }
  }
  p {
    color: var(--active-color);
    font-size: 17px;
  }
}
</style>