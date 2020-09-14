<template lang="pug">
.article-group
  .article-link
    p {{ article.date }}
    h4 {{ article.title }}
  .tag-group
    Tag(text='Europe')
    Tag(text='swimming')
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue';

export type DataTag = { uri: string; text: string };
export type DataArticle = { date: Date; title: string, url: string, tags: DataTag[] };

@Component({ components: { Tag } })
export default class Article extends Vue {
  @Prop() article!: DataArticle
  format = { year: 'numeric', month: 'long' };
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