
import {
  Module,
  VuexModule,
  Action,
  getModule,
  Mutation
} from "vuex-module-decorators";
import Vue from "vue";
import * as n3 from "n3";
import store, { Averages, DataArticle, Sport } from "@/store";
import { useRecipe } from '@/utils/hiccupConnector';
import { utcYears } from 'd3';
import { continentMap } from "@/store/continentsM"

export type DataSportYear = {
  Africa: DataSportValues;
  Asia: DataSportValues;
  Europe: DataSportValues;
  'North America': DataSportValues;
  'South America': DataSportValues;
  Oceania: DataSportValues;
};
export function defaultDataSportYear(): DataSportYear {
  const obj: DataSportYear = {
    'Africa': defaultDataSportValues(),
    'Asia': defaultDataSportValues(),
    'Europe': defaultDataSportValues(),
    'North America': defaultDataSportValues(),
    'South America': defaultDataSportValues(),
    Oceania: defaultDataSportValues(),
  };
  return obj;
}
export type DataSportValues = { medalCount: number; athleteCount: number };
function defaultDataSportValues(): DataSportValues {
  const obj: DataSportValues = { medalCount: 0, athleteCount: 0 };
  return obj;
}

@Module({ dynamic: true, namespaced: true, name: "sportsM", store })
class SportsModule extends VuexModule {
  sportsMap: { [key: string]: string } = {}
  sport: Sport | null = null;
  articles: DataArticle[] = []
  averages: { [year: string]: { female: Averages, male: Averages } } = {}
  sportsOverTime: { [year: string]: DataSportYear } = {}
  axisMax: number = 0;
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
    const store = new n3.Store(quadArr);
    const medalCountQuad = store.getQuads(null, "http://wallscope.co.uk/ontology/olympics/totalMedalCount", null, defaultG).find(x => !!x)
    const uri = medalCountQuad!.subject
    const medalCount = +(medalCountQuad!.object!.value)
    const athCount = +store.getObjects(uri, "http://wallscope.co.uk/ontology/olympics/totalAthleteCount", defaultG).find(x => !!x)!.value
    const season = store.getObjects(uri, "http://www.w3.org/2000/01/rdf-schema#label", defaultG).find(x => !!x)!.value
    this.sport = new Sport(uri.id, name!, season, medalCount, athCount)
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

  @Mutation
  setSportAverages({ mArr, fArr }: { mArr: n3.Quad[], fArr: n3.Quad[] }) {
    const defaultG = new n3.DefaultGraph();
    const fStore = new n3.Store(fArr)
    const mStore = new n3.Store(mArr)


    const female: { [key: string]: Averages } = {};
    const male: { [key: string]: Averages } = {};
    fStore.getSubjects(null, null, defaultG).map(s => {
      const yearArr = (fStore.getObjects(s, "http://dbpedia.org/property/year", defaultG))
      if (yearArr.length > 0) {
        const year = yearArr[0].value
        const avgFH = Math.round(+fStore.getObjects(s, "http://wallscope.co.uk/ontology/olympics/averageHeight", defaultG).find(x => !!x)!.value)
        const avgFW = Math.round(+fStore.getObjects(s, "http://wallscope.co.uk/ontology/olympics/averageWeight", defaultG).find(x => !!x)!.value)
        const avgFA = Math.round(+fStore.getObjects(s, "http://wallscope.co.uk/ontology/olympics/averageAge", defaultG).find(x => !!x)!.value)

        female[year] = new Averages(avgFH, avgFW, undefined, avgFA)
      }
    });
    mStore.getSubjects(null, null, defaultG).map(s => {
      const yearArr = (mStore.getObjects(s, "http://dbpedia.org/property/year", defaultG))
      if (yearArr.length > 0) {
        const year = yearArr[0].value
        const avgH = Math.round(+mStore.getObjects(s, "http://wallscope.co.uk/ontology/olympics/averageHeight", defaultG).find(x => !!x)!.value)
        const avgW = Math.round(+mStore.getObjects(s, "http://wallscope.co.uk/ontology/olympics/averageWeight", defaultG).find(x => !!x)!.value)
        const avgA = Math.round(+mStore.getObjects(s, "http://wallscope.co.uk/ontology/olympics/averageAge", defaultG).find(x => !!x)!.value)
        male[year] = new Averages(avgH, avgW, undefined, avgA)
      }
    });
    Object.keys(female).forEach(k => {
      this.averages[k] = { female: female[k], male: male[k] }
    })

  }

  @Mutation
  async setSportsOverTime(quadArr: n3.Quad[]) {
    const defaultG = new n3.DefaultGraph();
    const store = new n3.Store(quadArr);
    this.axisMax = 0;
    store.getSubjects("http://wallscope.co.uk/ontology/olympics/hasYear", null, defaultG).forEach(s => {
      const year = store.getObjects(s, "http://wallscope.co.uk/ontology/olympics/hasYear", defaultG).find(x => !!x)!.value
      const continentUri = store.getObjects(s, "http://wallscope.co.uk/ontology/olympics/hasContinent", defaultG).find(x => !!x)!.value
      const medals = +store.getObjects(s, "http://wallscope.co.uk/ontology/olympics/medalCount", defaultG).find(x => !!x)!.value
      const athletes = +store.getObjects(s, "http://wallscope.co.uk/ontology/olympics/athleteCount", defaultG).find(x => !!x)!.value
      if (!this.sportsOverTime[year]) {
        this.sportsOverTime[year] = defaultDataSportYear()
      }
      const continentName = continentMap[continentUri]!
      this.axisMax = Math.ceil(Math.max(this.axisMax, athletes, medals) / 50) * 50;
      Vue.set(this.sportsOverTime[year], continentName, { medalCount: medals, athleteCount: athletes })
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
  async fetchSportAverages({ sport }: { sport: string }) {
    const fPayload = { s: sport, o: "<http://wallscope.co.uk/resource/olympics/gender/F>" }
    const mPayload = { s: sport, o: "<http://wallscope.co.uk/resource/olympics/gender/M>" }
    const fResp = await useRecipe("sport-averages", fPayload)
    const mResp = await useRecipe("sport-averages", mPayload)
    const parser = new n3.Parser();
    const mArr = parser.parse(mResp);
    const fArr = parser.parse(fResp);
    this.setSportAverages({ mArr, fArr })
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

  @Action
  async fetchSportsOverTime({ sport }: { sport: string }) {
    const payload = { s: sport }
    const resp = await useRecipe("sport-bar", payload)
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp)
    this.setSportsOverTime(quadArr)
  }

  get getArticles() {
    return this.articles
  }

  get getSportsOverTime() {
    return this.sportsOverTime
  }
  get sports() {
    return this.sportsMap;
  }
  get getSport() {
    return this.sport;
  }
  get getSportAverages() {
    return this.averages
  }
}

export default getModule(SportsModule);
