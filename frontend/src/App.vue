<template lang="pug">
#container
  #app
    ArrowUp
    #top.navbar-group
      Navbar
      SearchBar(
        :query='query',
        :results='searchResults',
        @input='search',
        @selected='selected = $event',
        @confirm="navigate"
      )
    router-view
    Footer
</template>

<script lang="ts">
import 'vue-loading-overlay/dist/vue-loading.css';
import { Component, Vue } from 'vue-property-decorator';
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/Navbar.vue';
import SearchBar from '@/components/SearchBar.vue';
import ArrowUp from '@/components/ArrowUp.vue';
import athleteM from '@/store/athletesM';
import Loading from 'vue-loading-overlay';
import searchM from '@/store/searchM';
import { SearchResult } from './store';
@Component({ components: { Footer, Navbar, SearchBar, ArrowUp, Loading } })
export default class App extends Vue {
  searchResults: SearchResult[] = [];
  query: string = '';
  selected: SearchResult | null = null
  async search(query: string) {
    this.query = query;
    if (this.query.length > 3 && this.query !== this.selected?.label) {
      await searchM.search(query);
      this.searchResults = searchM.sortedResults;
    }
  }

  navigate() {
    if(!this.selected) return;
    switch (this.selected.type) {
      case 'https://schema.org/Continent':
        this.$router.push(`/continent/${this.selected.uri.split('/').pop()}`);
        return;
      case 'http://xmlns.com/foaf/0.1/Person':
        this.$router.push(`/athlete/${this.selected.uri.split('/').pop()}`);
        return;
      case 'http://dbpedia.org/ontology/SportsEvent':
        this.$router.push(`/sport/${this.selected.uri.split('/').pop()}`);
        return;
    }
  }
}
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
  --grey-page: #dee0e6;
  --grey-search-bar: #e8ebf6;
  --active-color: #022fcc;
}

body {
  padding: 0;
  margin: 0;
  background: var(--grey-page);
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  padding: 5px 0;
  margin: 0;
}

.chart-title {
  color: var(--violet);
  font-size: 18px;
  margin-bottom: 20px;
}

.chart-subtitle {
  color: var(--violet);
  font-size: 14px;
  margin-bottom: 5px;
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
    @media only screen and (max-width: 1301px) {
      margin-bottom: 15px;
      margin-top: 5px;
    }
  }
  .charts {
    display: grid;
    grid-gap: 25px;
    > div {
      background: white;
      padding: 14px 20px;
      box-shadow: 7px 5px 4px #0000000d;
    }
  }
  @media only screen and (max-width: 768px) {
    padding: 20px 25px 60px 25px;
  }
}
.athletsList {
  > div {
    margin-bottom: 10px;
  }
}
.echarts {
  width: unset !important;
  height: 400px;
  > div {
    width: unset !important;
  }
}
@media only screen and (max-width: 768px) {
  // .echarts {
  //   max-width: 100% !important;
  //   width: 450px !important;
  //   height: 350px !important;
  // }
}
@media only screen and (min-width: 1400px) {
  .navbar-group {
    width: 100%;
    display: grid;
    grid-template-columns: 0.8fr 1.5fr 0.5fr;
    grid-template-rows: 30px 60px 30px;
    > div {
      &:nth-child(1) {
        grid-column: 1/4;
        grid-row: 1/3;
      }
      &:nth-child(2) {
        grid-column: 2/3;
        grid-row: 2/4;
      }
    }
  }
}
</style>
