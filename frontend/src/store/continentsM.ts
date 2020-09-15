
import {
  Module,
  VuexModule,
  Action,
  getModule,
  Mutation
} from "vuex-module-decorators";
import Vue from "vue";
import * as n3 from "n3";
import store from "@/store";
import { useRecipe } from '@/utils/hiccupConnector';

@Module({ dynamic: true, namespaced: true, name: "continentM", store })
class ContinentsModule extends VuexModule {
  continentMap: { [key: string]: string } = {}

  @Mutation
  setContinents(quads: n3.Quad[]) {
    const defaultG = new n3.DefaultGraph();
    const store = new n3.Store(quads)
    store.getSubjects("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "https://schema.org/Continent", defaultG).forEach(c => {
      const label = store.getObjects(c, "http://www.w3.org/2000/01/rdf-schema#label", defaultG).find(x => !!x)
      if (label) {
        this.continentMap[label.value] = c.id
      }
    });
  }
  @Action
  async fetchContinents() {
    const payload = { p: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", o: "<https://schema.org/Continent>" };
    const resp = await useRecipe("list", payload);
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setContinents(quadArr);
  }

  get continents() {
    return this.continentMap;
  }
}

export default getModule(ContinentsModule);
