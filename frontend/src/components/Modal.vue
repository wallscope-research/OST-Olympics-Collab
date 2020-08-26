<template lang="pug">
  transition(name='modal')
    .modal-mask(@click="close")
      .modal-wrapper
        .modal-container(@click.stop="")
          .modal-header
            slot(name='header')
              h3 About
            button.modal-default-button(@click="close")
              icon(:icon="['far','times']")
          .modal-body
            slot(name='body')
              p 
                | Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                | ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                | laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                | velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                | sunt in culpa qui officia deserunt mollit anim id est laborum.
              
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class Modal extends Vue {
  close() {
    this.$emit('close');
  }
}
</script>

<style lang="scss" scoped>
.modal-header {
  display: flex;
  button {
    margin-left: auto;
  }
  h3 {
    font-size: 20px;
    font-weight: normal;
  }
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-container {
  width: 80vw;
  height: 70vh;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #fff;
  max-height: 100vh;
  max-width: 1000px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(32, 8, 8, 0.3);
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #000000;
  }
  @media only screen and (max-width: 768px ) {
    width: 100vw;
    height: 95vh;
  }
}
.modal-body {
  margin: 10px 0 10px 0;
}
.modal-default-button {
  float: right;
  background: transparent;
  border:none;
  outline: none;
  cursor:pointer;
  svg {
    font-size: 24px;
  }
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>