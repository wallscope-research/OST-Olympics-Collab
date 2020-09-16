<template lang="pug">
.article-group
  .article-link
    p {{ formattedDate }}
    a(:href='article.url', target='_blank')
      h4(v-html='escapedTitle')
  .tag-group
    Tag(:key="t.uri" v-for='t in article.tags', @click='$emit("tag-clicked", t.uri)', :text='t.text')
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue';
import type { DataArticle } from '@/store';

@Component({ components: { Tag } })
export default class Article extends Vue {
  @Prop() article!: DataArticle;
  format = { year: 'numeric', month: 'long' };
  get formattedDate() {
    if (!this.article.date) return 'No Date';
    return this.article.date.toLocaleDateString('en-GB', this.format);
  }
  get escapedTitle() {
    return this.article.title;
  }
}
</script>

<style lang="scss" scoped>
.article-group {
  margin-bottom: 12px;
  p {
    color: #566598;
    padding-bottom: 0;
  }
  .article-link {
    cursor: pointer;
    &:hover {
      h4,
      svg {
        color: var(--active-color);
      }
    }
    h4 {
      padding: 0;
      padding-bottom: 5px;
      line-height: 22px;
    }
  }
  .tag-group {
    display: flex;
    justify-content: flex-end;
    > div {
      margin-left: 8px;
    }
  }
}
</style>