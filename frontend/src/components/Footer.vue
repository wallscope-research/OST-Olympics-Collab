<template lang="pug">
  #footer
  
      h5 Powered by:
      a(href="https://www.oxfordsemantic.tech/product" target="_blank")
        img.second(
          src="@/assets/Oxford_Semantic_Search_Logo.svg" 
          alt="Oxford Semantic Technology Logo"
        )
      a(href="https://wallscope.co.uk" target="_blank")
        .logo
          img(src="@/assets/Wallscope_logo.png" alt="Wallscope Logo")
          p.name Wallscope
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {}
</script>


<style lang="scss">
#footer {
  display: flex;
  flex-direction: column;
  background: #3e4a70;
  min-height: 100px;
  padding: 20px 50px 40px 50px;
  align-items: flex-end;
  a {
    text-decoration: none;
    max-width: auto;
  }
  .logo {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    padding: 3px;
    &:hover {
      background: #515f8b;
      transition: all 0.2s;
    }
  }
  h5 { 
    font-size: 18px;
    color: white;
    margin-bottom: 10px;
    font-weight: normal;
  }
  p {
    color: white;
    &.name {
      font-family: Arial, Helvetica, sans-serif;
      font-weight: bold;
      font-size: 22.5px;
    }
  }
  img {
    height: 25px;
    margin-right: 3px;
    background: transparent;
    padding: 3px;
    &.second {
      height: 38px;
      margin-right: 0;
    }
    &:hover {
      background: #515f8b;
      transition: all 0.2s;
    }
  }
}
</style>