<template lang="pug">
.container
  .tag
    p {{ text }}
</template>


<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class Tag extends Vue {
  @Prop() text!: string;
}
</script>


<style lang="scss">
.container {
  width:fit-content;
}
.tag {
  cursor: pointer;
  background: #F6F4F4;
  border-radius: 30px;
  padding: 2px 10px;
  height: 28px;
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
    font-size: 18px;
  }
}
</style>