
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

export class Sport {

  name: string

  constructor(name: string) {
    this.name = name;
  }
}

@Module({ dynamic: true, namespaced: true, name: "sportsM", store })
class SportsModule extends VuexModule {
  sportsMap: { [key: string]: string } = {}

  @Mutation
  setSports(quads: n3.Quad[]) {
    const defaultG = new n3.DefaultGraph();
    const store = new n3.Store(quads)
    store.getSubjects("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://dbpedia.org/ontology/Sport", defaultG).forEach(c => {
      const label = store.getObjects(c, "http://www.w3.org/2000/01/rdf-schema#label", defaultG).find(x => !!x)
      if (label) {
        this.sportsMap[label.value] = c.id
      }
    });
  }
  @Action
  async fetchSports() {
    const payload = { p: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", o: "<http://dbpedia.org/ontology/Sport>" };
    const resp = await useRecipe("list", payload);
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setSports(quadArr);
  }

  get sports() {
    return this.sportsMap;
  }
}

export default getModule(SportsModule);
