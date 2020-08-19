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

<style>
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
}
</style>
