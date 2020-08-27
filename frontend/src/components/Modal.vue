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
              .about-text
                p 
                  | Data management and integration has always been a huge problem with floods
                  |  of new documents (health records, contracts, spreadsheets with columns titled ‘CY3’
                  |  and a Word document naturally stored somewhere else telling you what ‘CY3’ means), financial
                  |  transactions, social media mentions, staff payroll updates, website traffic tracking data, and the list goes on…
                p 
                  | Handling all of this data 
                  b as it comes in live 
                  | and assimilating it with existing information is a challenge for businesses of every size. 
                  | This challenge cannot go ignored either - especially in the current climate. Efficiently utilising this unified data in real-time could
                  | help the public sector control budget cuts, large businesses retain their staff, and small businesses survive.
                p 
                  | To imitate the disparity in data sources within organisations, we have brought together a few different data sources and built this demo.
                  | You can 
                  a(href="https://medium.com/" target="_blank" alt="link to the Medium blog article") read about 
                  | how this was all created and feel free to get in touch with 
                  a(href="https://wallscope.co.uk" target="_blank" alt="link to the Wallscope website") Wallscope 
                  | and 
                  a(href="https://www.oxfordsemantic.tech/" target="_blank" alt="link to the Oxford Semantic Technologies website") Oxford Semantic Technologies
              .links
                div
                  p Read more on:
                  a(href="https://medium.com/" target="_blank")
                    img.medium(
                      src="@/assets/Wordmark_Black.png" 
                      alt="Medium Logo"
                    )
                div
                  p Get in touch:
                  div
                    a(href="https://wallscope.co.uk" target="_blank")
                        img.wallscope(src="@/assets/Wallscope-logo-on-white.png"
                        alt="Wallscope Logo"
                      )
                    a(href="https://www.oxfordsemantic.tech/product" target="_blank")
                      img.second(
                        src="@/assets/Oxford-Semantic-Technologies_black.png" 
                        alt="Oxford Semantic Technology Logo"
                      )
                  



              
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
.links {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 70px;
  @media only screen and (max-width: 768px ) {
    grid-template-columns: 1fr;
  }
  >div {
    &:nth-child(2){
      align-items: center;
      display: flex;
      flex-direction: column;
      div {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap:30px;
        align-items: center;
      }
    }
  }
  p {
    color: black;
    margin-bottom: 10px;
  }
  img {
    height: 25px;
    margin-right: 3px;
    background: transparent;
    padding: 3px;
    &.second{
      height: 70px;
      margin-right: 0;
    }
    &.wallscope {
      height: 90px;
    }
    &.medium {
      margin-top: 40px;
    }
  }
}
.modal-header {
  display: flex;
  button {
    margin-left: auto;
  }
  h3 {
    font-size: 20px;
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
  padding: 30px 40px;
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
  padding-top:40px;
  margin: 10px 0 10px 0;
  p {
    font-size: 18px;
    line-height: 28px;
    margin-bottom: 20px;
  }
  .about-text{
    a {
      color: var(--active-color);
      text-decoration: none;
      border-bottom: 1.5px solid transparent;
      &:hover {
        border-bottom: 1.5px solid var(--active-color);
        transition: all 0.2s;
      }
    }
  }
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