<template lang="pug">
div
  h2.chart-title News
  Article(v-for='a in articles', :article="a")
</template>


<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import Article, { DataArticle } from '@/components/Article.vue';
import { useRecipe } from '@/utils/hiccupConnector';

@Component({ components: { Article } })
export default class News extends Vue {
  @Prop({ required: true }) articles!: DataArticle[];

  @Watch('param')
  newParam(newval: string, oldval: string) {
    console.log(oldval, newval);
  }
}
</script>


<style lang="scss">
</style>