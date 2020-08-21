<template lang="pug">
.container(title="search by")
  .tag
    p {{ tagText }}
</template>


<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class Tag extends Vue {
  @Prop() tagText!: string;
}
</script>


<style lang="scss">
.container {
  width:fit-content;
}
.tag {
  cursor: pointer;
  background: #f1f1f1;
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