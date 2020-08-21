<template lang="pug">
  #app
    .navbar-group
      Navbar
      SearchBar
    router-view
    Footer
</template>

<script lang="ts">
  import Footer from '@/components/Footer.vue';
  import Navbar from '@/components/Navbar.vue';
  import SearchBar from '@/components/SearchBar.vue';
  import { Component, Vue } from 'vue-property-decorator';
  @Component({ components: { Footer, Navbar, SearchBar } })
  export default class App extends Vue {}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;700&display=swap');
#app {
  font-family: 'Ubuntu', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

:root {
  --violet: #566598;
  --grey-page: #E8E8E8;
  --grey-search-bar: #F6F4F4;
  --active-color: #022FCC;
}

body {
  padding:0;
  margin:0;
  background: var(--grey-page);
}

p, h1, h2, h3, h4, h5, h6 {
  padding: 5px 0;
  margin:0;
}

.chart-title {
  color: var(--violet);
  font-size: 18px;
  margin-bottom: 20px;
}
.navbar-group {
  width: 100%;
  display: grid;
  grid-template-columns: 0.8fr 1.5fr 0.5fr;
  grid-template-rows: 30px 60px 30px;
  > div {
    &:nth-child(1){
      grid-column: 1/4;
      grid-row: 1/3;
    }
    &:nth-child(2){
      grid-column: 2/3;
      grid-row: 2/4;
    }
  }
}
.home {
  padding: 12px 50px 60px 50px;
  .title-page {
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    svg {
      font-size: 22px;
      color: var(--violet);
      margin-right: 8px;
    }
    h3 {
      font-size: 22px;
      color: var(--violet);
      font-weight: normal;
    }
  }
  .charts {
    display: grid;
    grid-gap: 25px;
    >div {
      background: white;
      padding: 14px 20px;
      box-shadow: 9px 8px 10px #00000017;
    }
  }
}
.athletsList {
  >div {
    margin-bottom: 10px;
  }
}
</style>
