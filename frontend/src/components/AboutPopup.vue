<template lang="pug">
#aboutContainer.container
  .about
    .round(@click='checkStatus', title='About the project')
      p ?
    .aboutContent(:class='{ show: tipOn }')
      div
        .text
          h2 What is this?
          p {{ desc }}
          h2 How did we do it?
          p {{ how }}
        icon(:icon='["far", "times"]', @click='tipOn = false')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class AboutPopup extends Vue {
  @Prop({ required: true }) desc!: string;
  @Prop({ required: true }) how!: string;
  tipOn = false;

  checkStatus() {
    this.tipOn = this.tipOn ? false : true;
  }
}
</script>

<style lang="scss" scoped>
@keyframes fold {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes unfold {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
#aboutContainer {
  padding-top: 10px;
  padding-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 60px;
  grid-gap: 10px;
  align-items: center;
  .about {
    align-self: right;
    justify-self: right;
    display: flex;
    flex-direction: column;
    .round {
      background: var(--violet);
      height: 40px;
      width: 40px;
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 3px 2px 9px var(--violet);
      cursor: pointer;
      &:hover {
        background: var(--active-color);
        transition: all 0.2s ease-in-out;
        box-shadow: 11px 3px 9px var(--violet);
      }
      p {
        font-size: 25px;
        font-weight: bold;
        color: white;
      }
    }
    .aboutContent {
      height: 0;
      width: 0;
      overflow: hidden;
      position: absolute;
      z-index: 99999;
      max-width: 70vw;
      margin-top: 62px;
      background: white;
      margin-right: 0;
      box-shadow: 6px 6px 20px #797979;
      float: right;
      animation: fold 0.5s;
      > div {
        padding: 12px 20px 40px 30px;
        svg {
          justify-self: center;
        }
        .text {
          p {
            margin: 10px 0;
          }
          a {
            text-decoration: none;
            color: #027192;
            font-weight: bold;
          }
        }
      }
      &.show {
        animation: unfold 0.5s;
        display: block;
        height: auto;
        width: 680px;
        max-height: 98vh;
        overflow: auto;
      }
      svg {
        display: none;
      }
    }
  }
}
h1 {
  font-size: 23px;
  color: white;
  font-weight: normal;
}
h3 {
  font-weight: normal;
  font-size: 22px;
}
@media screen and (max-width: 599px) {
  h1 {
    font-size: 18px;
  }
  h3 {
    margin-top: 15px;
  }
  #topBar .about .aboutContent {
    padding-top: 25px;
    svg {
      font-size: 30px;
      margin-top: 12px;
      color: #50a8bf;
      cursor: pointer;
    }
    &.show {
      width: 100vw;
      height: 100vh;
    }
    margin-left: 0;
    margin-top: 0;
    left: 0;
    top: 0;
    svg {
      display: block;
    }
    > div {
      display: grid;
      grid-template-columns: 1fr 50px;
      grid-gap: 10px;
    }
  }
}
</style>