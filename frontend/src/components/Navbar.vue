<template lang="pug">
  #topBar
    .pageTitle
      h2 The Olympics: A Linked Data Platform
    .button(id="show-modal" @click="showModal = true")
      p About
    Modal(v-if="showModal" @close="showModal = false")
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue'


@Component({ components: { Modal}})
export default class Navbar extends Vue {
  showModal= false;
}
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
  .button, .pageTitle {
    cursor: pointer;
  }
  .button {
    padding: 0 10px;
    p {
      color: white;
      border-bottom: 3px solid transparent;
    }
    &:hover {
      p {
        border-bottom: 3px solid #142f65;
      }
      // background: #3d4e88;
    }
  }
  h2 {
    font-size: 26px;
    color: white;
    font-weight: normal;
  }
  > div {
    display: flex;
    &:nth-child(2) {
      justify-content: flex-end;
      p {
        font-size: 19px;
      }
    }
  }
  @media only screen and (max-width: 768px ) {
    .button {
      p {
        padding: 0;
        border:none;
        &:hover {
          border:none;
        }
      }
    }
    padding: 15px 25px 15px 25px;
    h2 {
      font-size: 24px;
      line-height: 30px;
      padding:0;
    }
    div.button {
      padding: 0;
    }
  }
  @media only screen and (min-width:769px) and (max-width:1400px){
    padding: 20px 50px 20px 50px;
  }
}
</style>
