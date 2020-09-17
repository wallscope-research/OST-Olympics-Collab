
import {
  Module,
  VuexModule,
  Action,
  getModule,
  Mutation
} from "vuex-module-decorators";
import Vue from "vue";
import * as n3 from "n3";
import ss from 'string-similarity';
import store, { SearchResult } from "@/store";
import { useRecipe } from '@/utils/hiccupConnector';

@Module({ dynamic: true, namespaced: true, name: "searchM", store })
class SearchModule extends VuexModule {
  searchQuery: string | null = null
  results: SearchResult[] | null = null

  @Mutation
  parseResults(quads: n3.Quad[]) {
    const defaultG = new n3.DefaultGraph();
    const store = new n3.Store(quads)
    this.results = store.getQuads(null, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", null, defaultG).map(q => {
      const label = store.getObjects(q.subject, "http://www.w3.org/2000/01/rdf-schema#label", defaultG).find(x => !!x)
      if (label) {
        const score = ss.compareTwoStrings(this.searchQuery, label.value)
        const type = q.object.id
        const res: SearchResult = {
          score,
          type,
          label: label.value,
          uri: q.subject.id
        }
        return res
      }
      return
      // javascript really needs a mapNotNull
      // Kotlin 1 - 0 Javascript
    }).filter(x => x != null) as SearchResult[];
  }

  @Mutation
  setResults(res: SearchResult[] | null) {
    this.results = res
  }

  @Mutation
  setSearchQuery(q: string | null) {
    this.searchQuery = q;
  }

  @Action
  async search(q: string) {
    this.setSearchQuery(q)
    this.setResults(null)
    const payload = { o: this.searchQuery };
    const resp = await useRecipe("search", payload);
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.parseResults(quadArr);
  }

  get sortedResults() {
    if (!this.results) return []
    return [...this.results].sort((a, b) => b.score - a.score);
  }
  get loading() {
    return this.searchQuery && (this.results === null)
  }
}

export default getModule(SearchModule);