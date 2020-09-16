
import {
  Module,
  VuexModule,
  Action,
  getModule,
  Mutation
} from "vuex-module-decorators";
import Vue from "vue";
import * as n3 from "n3";
import store, { DataArticle } from "@/store";
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
  articles: DataArticle[] = []

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

  @Mutation
  setSportArticles(quadArr: n3.Quad[]) {
    const defaultG = new n3.DefaultGraph();
    const store = new n3.Store(quadArr)
    this.articles = store.getSubjects("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://wallscope.co.uk/ontology/File", defaultG).map(f => {
      const title = store.getObjects(f, "http://schema.org/text", defaultG).find(x => !!x)!.value
      const url = store.getObjects(f, "http://schema.org/url", defaultG).find(x => !!x)!.value
      const tags = store.getObjects(f, "http://purl.org/dc/terms/subject", defaultG).flatMap(s => {
        return store.getObjects(s, "http://purl.org/dc/terms/relation", defaultG).map(r => {
          const label = store.getObjects(r, "http://www.w3.org/2000/01/rdf-schema#label", defaultG).find(x => !!x)!.value
          return { uri: r.id, text: label }
        })
      })
      // <file://home/antero/Wallscope/DATA/news/reddit/results-sm/olympic-rs-2016-08-10784.txt
      // extract date from filename
      const dateStr = f.id.split("olympic-rs-").pop()?.split(".txt")?.shift()
      const split = dateStr?.split("-")
      const year = split?.[0];
      const month = split?.[1];
      const date = year && month ? new Date(`${year}-${month}`) : null;
      return { title, url, date, tags }
    })
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

  @Action
  async fetchSportArticles() {
    if (!this.sport) return;
    const payload = { o: this.sport!.name }
    const resp = await useRecipe("text/related", payload);
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setSportArticles(quadArr);
  }

  get getArticles() {
    return this.articles
  }

  get sports() {
    return this.sportsMap;
  }
  get getSport() {
    return this.sport;
  }
}

export default getModule(SportsModule);
