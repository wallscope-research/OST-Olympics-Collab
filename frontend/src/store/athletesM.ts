
import {
  Module,
  VuexModule,
  Action,
  getModule,
  Mutation
} from "vuex-module-decorators";
import Vue from "vue";
// import { api } from "@/utils/api";
import store from "@/store";
import { Sport } from "@/store/sportsM"
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
]

const predMap: { [key: string]: string } = {
  weight: "http://dbpedia.org/ontology/weight",
  continent: "http://wallscope.co.uk/ontology/olympics/hasContinent",
  team: "http://dbpedia.org/ontology/team",
  sport: "http://wallscope.co.uk/ontology/olympics/sport",
  medals: "http://wallscope.co.uk/ontology/olympics/medalCount",
  gender: "http://xmlns.com/foaf/0.1/gender",
  name: "http://www.w3.org/2000/01/rdf-schema#label",
  height: "http://dbpedia.org/ontology/height",
  age: "http://wallscope.co.uk/ontology/olympics/age"
}
export class Athlete {
  name: string;
  sport?: Sport;
  height?: number;
  weight?: number;
  sex?: string;
  medals?: number;
  continent?: string;
  team?: string;
  age?: number;

  constructor(name: string, team?: string, sport?: Sport, height?: number, weight?: number, sex?: string, medals?: number, continent?: string, age?: number) {
    this.name = name;
    this.sport = sport;
    this.height = height;
    this.weight = weight;
    this.sex = sex;
    this.medals = medals;
    this.continent = continent;
    this.age = age;
  }

  static fromRDF(graph: n3.Store) {
    const defaultG = new n3.DefaultGraph();
    const name = graph.getObjects(null, predMap.name, defaultG).find(x => !!x)!.value;
    const weight = +graph.getObjects(null, predMap.weight, defaultG).find(x => !!x)!.value;
    const sport = graph.getObjects(null, predMap.sport, defaultG).find(x => !!x)!.value;
    const team = graph.getObjects(null, predMap.team, defaultG).find(x => !!x)!.value;
    const continent = graph.getObjects(null, predMap.continent, defaultG).find(x => !!x)!.value;
    const gender = graph.getObjects(null, predMap.gender, defaultG).find(x => !!x)!.value;
    const medals = +graph.getObjects(null, predMap.medals, defaultG).find(x => !!x)!.value;
    const height = +graph.getObjects(null, predMap.height, defaultG).find(x => !!x)!.value;
    const age = +graph.getObjects(null, predMap.age, defaultG).find(x => !!x)!.value
    return new Athlete(name, team, new Sport(sport), height, weight, gender, medals, continent, age)
  }
}

export class Averages {
  height?: number;
  weight?: number;
  medals?: number;
  age?: number;

  constructor(height?: number, weight?: number, medals?: number, age?: number) {
    this.height = height;
    this.weight = weight;
    this.medals = medals;
    this.age = age;
  }

  static fromRDF(store: n3.Store) {
    const defaultG = new n3.DefaultGraph();
    const avgs = {
      "weight": "http://wallscope.co.uk/ontology/olympics/averageWeight",
      "height": "http://wallscope.co.uk/ontology/olympics/averageHeight",
      "age": "http://wallscope.co.uk/ontology/olympics/averageAge",
      "medals": "http://wallscope.co.uk/ontology/olympics/averageMedals"
    }

    const weight = Math.round(+store.getObjects(null, avgs.weight, defaultG).find(x => !!x)!.value);
    const age = Math.round(+store.getObjects(null, avgs.age, defaultG).find(x => !!x)!.value);
    const height = Math.round(+store.getObjects(null, avgs.height, defaultG).find(x => !!x)!.value);
    const medals = Math.round(+store.getObjects(null, avgs.medals, defaultG).find(x => !!x)!.value);
    return new Averages(height, weight, medals, age)
  }
}

export type DataTag = { uri: string; text: string };
export type DataArticle = { date: Date | null; title: string; url: string; tags: DataTag[] };

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

  topMaleAthletes: Athlete[] = [];
  topFemaleAthletes: Athlete[] = [];

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

  get getTopMaleAthletes() {
    return this.topMaleAthletes
  }

  get getTopFemaleAthletes() {
    return this.topFemaleAthletes
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
  setTopAthletes({ maleArr, femaleArr }: { maleArr: n3.Quad[], femaleArr: n3.Quad[] }) {
    const maleG = new n3.DefaultGraph();
    const femaleG = new n3.DefaultGraph();
    const fStore = new n3.Store(femaleArr)
    const mStore = new n3.Store(maleArr);
    console.log(femaleArr)
    this.topMaleAthletes = mStore.getSubjects("http://www.w3.org/2000/01/rdf-schema#label", null, maleG).map(s => {
      const medals = +mStore.getObjects(s, "http://wallscope.co.uk/ontology/olympics/totalMedalCount", maleG).find(x => !!x)!.value
      const name = mStore.getObjects(s, "http://www.w3.org/2000/01/rdf-schema#label", maleG).find(x => !!x)!.value
      return new Athlete(name, undefined, undefined, undefined, undefined, undefined, medals, undefined, undefined)
    })

    this.topFemaleAthletes = fStore.getSubjects("http://www.w3.org/2000/01/rdf-schema#label", null, femaleG).map(s => {
      console.log(s)
      const medals = +fStore.getObjects(s, "http://wallscope.co.uk/ontology/olympics/totalMedalCount", femaleG).find(x => !!x)!.value
      const name = fStore.getObjects(s, "http://www.w3.org/2000/01/rdf-schema#label", femaleG).find(x => !!x)!.value
      console.log(name, medals)
      return new Athlete(name, undefined, undefined, undefined, undefined, undefined, medals, undefined, undefined)
    })
    console.log("hi")
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

  @Action({ rawError: true })
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

  @Action
  async fetchTopAthletes({ sport }: { sport: string }) {
    const [male, female] = await Promise.all([useRecipe("top-athletes", { s: sport, o: "<http://wallscope.co.uk/resource/olympics/gender/M>" }), useRecipe("top-athletes", { s: sport, o: "<http://wallscope.co.uk/resource/olympics/gender/F>" })])
    const parser = new n3.Parser();
    console.log(female);
    const maleArr = parser.parse(male);
    const femaleArr = parser.parse(female);
    console.log(femaleArr)
    this.setTopAthletes({ maleArr, femaleArr })
  }


}

export default getModule(AthletesModule);
