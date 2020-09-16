
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

  name: string;
  season?: string;
  medalCount?: number;
  athleteCount?: number;
  constructor(name: string, season?: string, medalCount?: number, athleteCount?: number) {
    this.name = name;
    this.season = season;
    this.medalCount = medalCount;
    this.athleteCount = athleteCount;
  }
}

@Module({ dynamic: true, namespaced: true, name: "sportsM", store })
class SportsModule extends VuexModule {
  sportsMap: { [key: string]: string } = {}
  sport: Sport | null = null;
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

  @Mutation
  setSportInfo({ quadArr, name }: { quadArr: n3.Quad[], name: string }) {
    const defaultG = new n3.DefaultGraph();
    console.log(quadArr)
    const store = new n3.Store(quadArr);
    const medalCount = +store.getObjects(null, "http://wallscope.co.uk/ontology/olympics/totalMedalCount", defaultG).find(x => !!x)!.value
    const athCount = +store.getObjects(null, "http://wallscope.co.uk/ontology/olympics/totalAthleteCount", defaultG).find(x => !!x)!.value
    const season = store.getObjects(null, "http://www.w3.org/2000/01/rdf-schema#label", defaultG).find(x => !!x)!.value
    console.log(medalCount, athCount, season)
    this.sport = new Sport(name!, season, medalCount, athCount)
  }
  @Action
  async fetchSports() {
    const payload = { p: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", o: "<http://dbpedia.org/ontology/Sport>" };
    const resp = await useRecipe("list", payload);
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setSports(quadArr);
  }


  @Action
  async fetchSportInfo({ sport, name }: { sport: string, name: string }) {
    const payload = { o: sport }
    const resp = await useRecipe("sport-info", payload)
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setSportInfo({ quadArr, name })
  }
  get sports() {
    return this.sportsMap;
  }
  get getSport() {
    return this.sport;
  }
}

export default getModule(SportsModule);
