<template lang="pug">
#aboutContainer.container
  .about
    .round(@click='checkStatus', title='About the section')
      p ?
    .aboutContent(:class='{ show: tipOn }')
      div
        .text
          h2 What is this?
          p {{ desc }}
          h2 How did we do it?
          p {{ how }}
          .links(v-if='links')
            h3 Links
            a(v-for='l in links', :href='l.link', target='_blank') {{ l.name }}
        icon(:icon='["far", "times"]', @click='tipOn = false')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class AboutPopup extends Vue {
  @Prop({ required: true }) desc!: string;
  @Prop({ required: true }) how!: string;
  @Prop({ required: false }) links!: { name: string; link: string }[];
  tipOn = false;

  checkStatus() {
    this.tipOn = this.tipOn ? false : true;
  }

  mounted() {
    if (this.links) console.log(this.links);
  }
}
</script>

<style lang="scss" scoped>
.links {
  display: flex;
  flex-direction: column;
}
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
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  height: 0;
  .about {
    align-self: right;
    justify-self: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 9;
    .round {
      background: #ffffff;
      height: 31px;
      width: 31px;
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 2px 2px 8px 3px #cacaca;
      cursor: pointer;
      &:hover {
        transition: all 0.2s ease-in-out;
        box-shadow: 2px 2px 8px 3px #bbbbbb;
        background: var(--active-color);
        p {
          color: white;
        }
      }
      p {
        font-size: 24px;
        font-weight: bold;
        color: var(--active-color);
      }
    }
    .aboutContent {
      height: 0;
      width: 0;
      overflow: hidden;
      position: absolute;
      margin-left: 0px;
      margin-top: 32px;
      background: white;
      margin-right: 0;
      box-shadow: 6px 6px 20px #797979;
      float: right;
      animation: fold 0.5s;
      > div {
        padding: 12px 20px;
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
        width: 330px;
        max-width: 80vw;
        max-height: 98vh;
        overflow: auto;
      }
      svg {
        display: none;
      }
    }
  }
}
</style>