<template lang="pug">
.home
  Navbar.navbar
  InfoBox.infobox
  MedalsAtAge.medals-at-age
  ParallelChart.stats
  News.news
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InfoBox from '@/components/InfoBox.vue';
import News from '@/components/News.vue';
import MedalsAtAge from '@/components/MedalsAtAge.vue';
import ParallelChart from '@/components/ParallelChart.vue';
import Navbar from '@/components/Navbar.vue';
@Component({ components: { InfoBox, News, MedalsAtAge, ParallelChart, Navbar } })
export default class Home extends Vue {}
</script>


<style lang="scss">
.home {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 5% 1fr 1fr 1fr;
  gap: 1px 1px;
  grid-template-areas: 'navbar navbar navbar navbar' 'infobox medals-at-age medals-at-age news' 'stats stats stats news' 'stats stats stats news';
}

.navbar {
  grid-area: navbar;
}

.infobox {
  grid-area: infobox;
}

.medals-at-age {
  grid-area: medals-at-age;
}

.news {
  grid-area: news;
}

.stats {
  grid-area: stats;
}
</style>