<template lang="pug">
#searchBar
  div
    
    form.searchbox.sbx-custom(novalidate='novalidate' onsubmit='return false;')
      .sbx-custom__wrapper(role='search')
        input.sbx-custom__input(type='search' name='search' placeholder='Search ...' autocomplete='off' required='required')
        button.sbx-custom__submit(type='submit' title='Submit your search query.')
          svg(role='img' aria-label='Search')
            use(xlink:href='#sbx-icon-search-18')
        button.sbx-custom__reset(type='reset' title='Clear the search query.')
          icon(:icon="['far','times']" aria-label='Reset')
   

  div
    div
      p You can search for:
    div
      .termType
        icon(:icon="['fas', 'globe-europe']")
        p continent
      .termType
        OlympicTorch(
          icon-width = 28
          icon-height = 40
        )
        p sport
      .termType
        icon(:icon="['fas', 'user']")
        p player
      span
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'vue-instant/dist/vue-instant.css'
import VueInstant from 'vue-instant/dist/vue-instant.common'
import OlympicTorch from '@/components/OlympicTorch.vue'
Vue.use(VueInstant)

@Component({components: { OlympicTorch }})
export default class SearchBar extends Vue {}
</script>

<style lang="scss">

.sbx-custom {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 51px;
  white-space: nowrap;
  box-sizing: border-box;
  font-size: 14px;
}

.sbx-custom__wrapper {
  width: 100%;
  height: 100%;
}

.sbx-custom__input {
  display: inline-block;
  -webkit-transition: box-shadow .4s ease, background .4s ease;
  transition: box-shadow .4s ease, background .4s ease;
  border: 0;
  border-radius: 26px;
  box-shadow: inset 0 0 0 2.5px #9c9c9c;
  background: #FFFFFF !important;
  padding: 0;
  padding-right: 41px;
  padding-left: 41px;
  width: 100%;
  height: 100%;
  vertical-align: middle;
  white-space: normal;
  font-size: 20px;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
}

.sbx-custom__input::-webkit-search-decoration, .sbx-custom__input::-webkit-search-cancel-button, .sbx-custom__input::-webkit-search-results-button, .sbx-custom__input::-webkit-search-results-decoration {
  display: none;
}

.sbx-custom__input:hover {
  box-shadow: inset 0 0 0 2px #b3b3b3;
}

.sbx-custom__input:focus, .sbx-custom__input:active {
  outline: 0;
  box-shadow: inset 0 0 0 2.5px var(--active-color);
  background: #FFFFFF;
}

.sbx-custom__input::-webkit-input-placeholder {
  color: #BBBBBB;
}

.sbx-custom__input::-moz-placeholder {
  color: #BBBBBB;
}

.sbx-custom__input:-ms-input-placeholder {
  color: #BBBBBB;
}

.sbx-custom__input::placeholder {
  color: #BBBBBB;
}

.sbx-custom__submit {
  position: absolute;
  top: 0;
  right: inherit;
  left: 0;
  margin: 0;
  border: 0;
  border-radius: 25px 0 0 25px;
  background-color: rgba(255, 255, 255, 0);
  padding: 0;
  width: 41px;
  height: 100%;
  vertical-align: middle;
  text-align: center;
  font-size: inherit;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}

.sbx-custom__submit::before {
  display: inline-block;
  margin-right: -4px;
  height: 100%;
  vertical-align: middle;
  content: '';
}

.sbx-custom__submit:hover, .sbx-custom__submit:active {
  cursor: pointer;
}

.sbx-custom__submit:focus {
  outline: 0;
}

.sbx-custom__submit svg {
  width: 31px;
  height: 31px;
  vertical-align: middle;
  fill: #FF2E83;
}

.sbx-custom__reset {
  display: none;
  position: absolute;
  top: 12px;
  right: 12px;
  width:27px;
  margin: 0;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  fill: rgba(0, 0, 0, 0.5);
}

.sbx-custom__reset:focus {
  outline: 0;
}

.sbx-custom__reset svg {
  display: block;
  margin: 4px;
  font-size: 17px;
  color:grey;
  &:hover {
    color: var(--active-color);
  }
}

.sbx-custom__input:valid ~ .sbx-custom__reset {
  display: block;
  -webkit-animation-name: sbx-reset-in;
          animation-name: sbx-reset-in;
  -webkit-animation-duration: .15s;
          animation-duration: .15s;
}

@-webkit-keyframes sbx-reset-in {
  0% {
    -webkit-transform: translate3d(-20%, 0, 0);
            transform: translate3d(-20%, 0, 0);
    opacity: 0;
  }
  100% {
    -webkit-transform: none;
            transform: none;
    opacity: 1;
  }
}

@keyframes sbx-reset-in {
  0% {
    -webkit-transform: translate3d(-20%, 0, 0);
            transform: translate3d(-20%, 0, 0);
    opacity: 0;
  }
  100% {
    -webkit-transform: none;
            transform: none;
    opacity: 1;
  }
}
#searchBar {
  background: var(--grey-search-bar);
  box-shadow: 9px 8px 10px #00000017;
  min-height: 50px;
  padding: 8px 15px 10px 20px;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-gap:25px;
  > div {
    &:nth-child(1){
      display: flex;
      align-items: center;
    }
    &:nth-child(2){
      > div {
        &:nth-child(1){
          p {
            font-size: 15px;
            padding:0;
            color: #635b75;
          }
        }
        &:nth-child(2){
          display: grid;
          grid-template-columns: auto  auto  auto 1fr;
          grid-gap: 20px;
          .termType{
            display: flex;
            align-items: center;
            p {
              font-size: 15px;
              color: #635b75;
            }
            img {
              width: 24px;
              margin-right: 5px;
            }
            svg {
              margin-right: 5px;
              color: #756c88;
              font-size: 25px;
            }
          }
          @media only screen and (max-width: 768px ) {
            grid-gap: 10px;
          }
        }
      }
    }
  }
}
@media only screen and (max-width: 768px ) {
  #searchBar {
    padding: 8px 25px 20px 25px;
    grid-template-columns: 1fr;
    grid-gap: 10px;
    > div {
      &:nth-child(2){
        grid-row: 1/2;
      }
    }
  }
}
@media only screen and (min-width:769px) and (max-width:1300px){
  #searchBar {
    padding: 8px 50px 10px 50px;
  }
}
@media only screen and (min-width: 1301px) {
}
</style>