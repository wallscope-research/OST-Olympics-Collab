
import {
  Module,
  VuexModule,
  Action,
  getModule,
  Mutation
} from "vuex-module-decorators";
import Vue from "vue";
import * as n3 from "n3";
import store, { Averages, DataArticle } from "@/store";
import { useRecipe } from '@/utils/hiccupConnector';
import { use } from 'vue/types/umd';

export const continentMap: { [key: string]: string } = {
  "http://dbpedia.org/resource/Oceania": "Oceania",
  "http://dbpedia.org/resource/North_America": "North America",
  "http://dbpedia.org/resource/South_America": "South America",
  "http://dbpedia.org/resource/Europe": "Europe",
  "http://dbpedia.org/resource/Africa": "Africa",
  "http://dbpedia.org/resource/Asia": "Asia"
}
@Module({ dynamic: true, namespaced: true, name: "continentM", store })
class ContinentsModule extends VuexModule {
  continentMap: { [key: string]: string } = {}
  continentURI: string = ''
  continentName: string = ''
  articles: DataArticle[] = []
  averageStats: Averages = {
    age: 0,
    height: 0,
    weight: 0,
    medals: 0,
  }
  continentInfo = { medals: 0, teams: 0, athletes: 0 }
  medalsVAthletes: { [key: string]: { athletes: number, medals: number } } = {}

  get getAverateStats() {
    return this.averageStats;
  }

  get getArticles() {
    return this.articles
  }

  get getMedalsVAthletes() {
    return this.medalsVAthletes
  }

  get getContinentInfo() {
    return this.continentInfo;
  }

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

  @Mutation
  setAverageStats(quadArr: n3.Quad[]) {
    const store = new n3.Store(quadArr)
    this.averageStats = Averages.fromRDF(store)
  }

  @Mutation
  setContinentArticles(quads: n3.Quad[]) {
    const defaultG = new n3.DefaultGraph();
    const store = new n3.Store(quads)
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
  setContinentURI(uri: string) {
    this.continentURI = uri
  }

  @Mutation
  setContinentName(name: string | undefined) {
    if (name) {
      this.continentName = name
    } else {
      this.continentName = "Unknown";
    }
  }


  @Mutation
  setMedalsVAthletes(quadArr: n3.Quad[]) {
    if (this.medalsVAthletes) this.medalsVAthletes = {};
    const defaultG = new n3.DefaultGraph();
    const store = new n3.Store(quadArr);
    store.getSubjects("http://wallscope.co.uk/ontology/olympics/hasYear", null, defaultG).forEach(s => {
      const year = store.getObjects(s, "http://wallscope.co.uk/ontology/olympics/hasYear", defaultG).find(x => !!x)!.value
      const medals = +store.getObjects(s, "http://wallscope.co.uk/ontology/olympics/medalCount", defaultG).find(x => !!x)!.value
      const athletes = +store.getObjects(s, "http://wallscope.co.uk/ontology/olympics/athleteCount", defaultG).find(x => !!x)!.value
      this.medalsVAthletes[year] = { medals, athletes }
    })
  }
  @Mutation
  setContinentInfo(quadArr: n3.Quad[]) {
    const defaultG = new n3.DefaultGraph();
    const store = new n3.Store(quadArr);
    const athleteCount = +store.getObjects(null, "http://wallscope.co.uk/ontology/olympics/athleteCount", defaultG).find(x => !!x)!.value
    const medalCount = +store.getObjects(null, "http://wallscope.co.uk/ontology/olympics/medalCount", defaultG).find(x => !!x)!.value
    const numberOfTeams = +store.getObjects(null, "http://wallscope.co.uk/ontology/olympics/numberOfTeams", defaultG).find(x => !!x)!.value
    this.continentInfo.athletes = athleteCount;
    this.continentInfo.medals = medalCount;
    this.continentInfo.teams = numberOfTeams;
  }

  @Action
  setContinent(uri: string) {
    this.setContinentURI(uri)
    this.setContinentName(uri.split("/").pop()?.replace("_", " "))
  }

  @Action
  async fetchAverageStats({ sport, continent, gender }: { sport?: string, gender?: string, continent?: string } = {}) {
    const params: { [key: string]: string } = {}
    if (continent) { params["o"] = `<${continent}>` }
    if (sport) { params["s"] = `<${sport}>` }
    if (gender) { params["p"] = `<${gender}>` }

    const [statsRDF, medalsRDF] = await Promise.all([useRecipe("stats", params), useRecipe("medals", params)])
    const parser = new n3.Parser();
    const quadArr1 = parser.parse(statsRDF);
    const quadArr2 = parser.parse(medalsRDF)
    const allQuads = quadArr1.concat(quadArr2)
    this.setAverageStats(allQuads);
  }

  @Action
  async fetchContinentArticles() {
    const payload = { o: this.continentName };
    const resp = await useRecipe("text/related", payload);
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setContinentArticles(quadArr);
  }

  @Action
  async fetchContinents() {
    const payload = { p: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", o: "<https://schema.org/Continent>" };
    const resp = await useRecipe("list", payload);
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setContinents(quadArr);
  }

  @Action
  async fetchContinentInfo({ name }: { name: string }) {
    const payload = { o: `<${this.continentMap[name]}>` }
    const resp = await useRecipe("continent-info", payload)
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setContinentInfo(quadArr)
  }

  @Action
  async fetchMedalsVAthletes({ sport }: { sport: string | undefined }) {

    const resp = await useRecipe("continent-medals-athletes", { s: sport })
    console.log(resp)
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setMedalsVAthletes(quadArr)

  }

  get continents() {
    return this.continentMap;
  }
}

export default getModule(ContinentsModule);
