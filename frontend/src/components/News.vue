<template lang="pug">
div
  h2.chart-title News
  Article(
    article-title='lLorem ipsum dolor sit amet, est ad quem utamur, vis in graece quaeque conceptam. At qui debitis complectitur, facilis feugait senserit has no. Melius intellegat no nec, sensibus euripidis gloriatur eam ad, an pri saepe voluptatibus.',
    article-date='February 2020'
  )
  Article(
    article-title='lLorem ipsum dolor sit amet, est ad quem utamur, vis in graece quaeque ',
    article-date='December 2019'
  )
</template>


<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import Article from '@/components/Article.vue';
import { useRecipe } from '@/utils/hiccupConnector';

@Component({ components: { Article } })
export default class News extends Vue {
  @Prop({ required: true }) param!: string;

  // async mounted() {
  //   if (this.param !== 'Pick a name') {
  //     console.log(this.param);
  //     const resp = await useRecipe('text/related', { o: this.param });
  //     console.log(resp);
  //   }
  // }

  // @Watch('param')
  // async paramChanged(newVal: string) {
  //   console.log(newVal);
  //   const split = this.param.split(' ');
  //   const mapped: any = {};
  //   for (var i = 1; i++; i < split.length + 1) {
  //     i === 1 ? (mapped['o'] = split[i - 1]) : (mapped['o' + i] = split[i - 1]);
  //   }
  //   const resp = await useRecipe('text/related', {
  //     o: 'Usain Bolt',
  //     // o: this.param,
  //     // o2: split[split.length - 1],
  //   });
  //   console.log(mapped);
  //   // console.log(resp);
  // }
}
</script>


<style lang="scss">
</style>