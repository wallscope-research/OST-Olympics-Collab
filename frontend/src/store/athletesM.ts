
import {
  Module,
  VuexModule,
  Action,
  getModule,
  Mutation
} from "vuex-module-decorators";
import Vue from "vue";
// import { api } from "@/utils/api";
import store, {Averages, Athlete, DataArticle} from "@/store";
import { useRecipe, makeURI } from "@/utils/hiccupConnector"
import * as n3 from "n3";

export const starterAthletes: string[] = [
  "http://wallscope.co.uk/resource/olympics/athlete/UsainStLeoBolt",
  "http://wallscope.co.uk/resource/olympics/athlete/NabilMuhammadAliNosseir",
  "http://wallscope.co.uk/resource/olympics/athlete/FrederickCarltonCarlLewis",
  "http://wallscope.co.uk/resource/olympics/athlete/MichaelFredPhelpsII",
  "http://wallscope.co.uk/resource/olympics/athlete/JamesClevelandJesseOwens",
  "http://wallscope.co.uk/resource/olympics/athlete/MarkAndrewSpitz",
  "http://wallscope.co.uk/resource/olympics/athlete/PaavoJohannesNurmi",
  "http://wallscope.co.uk/resource/olympics/athlete/SimoneArianneBiles",
  "http://wallscope.co.uk/resource/olympics/athlete/ChristopherAndrewChrisHoy",
  "http://wallscope.co.uk/resource/olympics/athlete/GregoryEfthimiosGregLouganis",
];

@Module({ dynamic: true, namespaced: true, name: "atheleteM", store })
class AthletesModule extends VuexModule {

  athlete: Athlete | null = null;
  graph = new n3.Store();
  athleteInfo: n3.Quad[] = []


  averageStats: Averages = {
    age: 0,
    height: 0,
    weight: 0,
    medals: 0,
  }

  articles: DataArticle[] = []

  averageMedalsPerAge: { [key: number]: number } = {}
  get getGraph() {
    return this.graph;
  }

  get getAthlete() {
    return this.athlete
  }

  get getAverateStats() {
    return this.averageStats;
  }

  get getAthleteInfo() {
    return this.athleteInfo
  }

  get getAverageMedalsPerAge() {
    return this.averageMedalsPerAge
  }

  get getArticles() {
    return this.articles
  }

  @Mutation
  setAthlete(athlete: Athlete) {
    this.athlete = athlete
  }

  @Mutation
  setGraph(quads: n3.Quad[]) {
    this.graph = new n3.Store(quads)
  }

  @Mutation
  setAthleteInfo(quadArr: n3.Quad[]) {
    this.athleteInfo = quadArr;
    const defaultG = new n3.DefaultGraph();
    this.athlete = Athlete.fromRDF(new n3.Store(quadArr));
  }
  @Mutation
  setAverageStats(quadArr: n3.Quad[]) {
    const store = new n3.Store(quadArr)
    this.averageStats = Averages.fromRDF(store)
  }

  @Mutation
  setMedalsAtAge(quadArr: n3.Quad[]) {
    const defaultG = new n3.DefaultGraph();
    const store = new n3.Store(quadArr)
    const avgMedalsPerAge: { [key: number]: number } = {};
    const subjs = store.getSubjects("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://wallscope.co.uk/ontology/olympics/MedalsPerAge", defaultG)

    subjs.forEach(subj => {
      const age = +store.getObjects(subj, "http://wallscope.co.uk/ontology/olympics/age", defaultG).find(x => !!x)!.value
      const medals = +store.getObjects(subj, "http://wallscope.co.uk/ontology/olympics/medals", defaultG).find(x => !!x)!.value
      avgMedalsPerAge[age] = medals
    })
    this.averageMedalsPerAge = avgMedalsPerAge
  }

  @Mutation
  setAthleteArticles(quads: n3.Quad[]) {
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

  @Action
  async fetchMedalsAtAge() {
    const resp = await useRecipe('medals-per-age', {})
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setMedalsAtAge(quadArr)
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
  async fetchAthleteInfo({ uri }: { uri: string }) {
    const payload = { s: uri };
    const resp = await useRecipe("athlete/info", payload);
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setAthleteInfo(quadArr);
  }

  @Action
  async fetchAthleteArticles() {
    const names = this.athlete?.name.split(" ")
    if (!names) return;
    const last = [...names].reverse().find(x => x.length > 2)
    // This hack is Michael Phelps fault cause he has to have a ", II" after his name
    // Actually, that's a posh name, it's posh people's fault
    const payload = { o: `${names.shift()} ${last?.replace(",", "") || names.pop()}` };
    const resp = await useRecipe("text/related", payload);
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    this.setAthleteArticles(quadArr);
  }

}

export default getModule(AthletesModule);
