
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

  static fromRDF(graph: n3.Store, uri?: string) {
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


@Module({ dynamic: true, namespaced: true, name: "atheleteM", store })
class AthletesModule extends VuexModule {

  athlete: Athlete = { name: makeURI("Jessica Phyllis Ennis-Hill", "athlete") };
  graph = new n3.Store();
  athleteInfo: n3.Quad[] = []


  averageStats = {
    age: 0,
    height: 0,
    weight: 0,
    medals: 0,
  }
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

  @Mutation
  setAthlete(athlete: Athlete) {
    this.athlete = athlete
  }

  @Mutation
  setGraph(quads: n3.Quad[]) {
    this.graph = new n3.Store(quads)
    console.log(this.graph)
  }

  @Mutation
  setAthleteInfo(quadArr: n3.Quad[]) {
    this.athleteInfo = quadArr;
    const defaultG = new n3.DefaultGraph();
    this.athlete = Athlete.fromRDF(new n3.Store(quadArr));
  }
  @Mutation
  setAverageStats(quadArr: n3.Quad[]) {
    const defaultG = new n3.DefaultGraph();
    const store = new n3.Store(quadArr)
    const avgs = {
      "weight": "http://wallscope.co.uk/ontology/olympics/totalAverageWeight",
      "height": "http://wallscope.co.uk/ontology/olympics/totalAverageHeight",
      "age": "http://wallscope.co.uk/ontology/olympics/totalAverageAge",
      "medals": "http://wallscope.co.uk/ontology/olympics/averageMedals"
    }

    const weight = Math.round(+store.getObjects(null, avgs.weight, defaultG).find(x => !!x)!.value);
    const age = Math.round(+store.getObjects(null, avgs.age, defaultG).find(x => !!x)!.value);
    const height = Math.round(+store.getObjects(null, avgs.height, defaultG).find(x => !!x)!.value);
    const medals = Math.round(+store.getObjects(null, avgs.medals, defaultG).find(x => !!x)!.value);
    this.averageStats = {
      age: age,
      height: height,
      weight: weight,
      medals: medals
    }
  }
  @Action
  async fetchAverageStats({ sport, continent }: { sport?: string, continent?: string }) {
    if (continent && continent.length > 0) {
      console.log("continent")
      const resp = await useRecipe("average/stats", { o: continent, p: 'http://wallscope.co.uk/ontology/olympics/hasContinent' })
      const resp2 = await useRecipe("athlete/medals", { o: continent, p: 'http://wallscope.co.uk/ontology/olympics/hasContinent' })
      const parser = new n3.Parser();

      const quadArr1 = parser.parse(resp);
      const quadArr2 = parser.parse(resp2)
      const allQuads = quadArr1.concat(quadArr2)
      console.log(allQuads);
      this.setAverageStats(allQuads);
    } else {
      const resp = await useRecipe("average/stats", {})
      const resp2 = await useRecipe("athlete/medals", {})
      const parser = new n3.Parser();

      const quadArr1 = parser.parse(resp);
      const quadArr2 = parser.parse(resp2)
      const allQuads = quadArr1.concat(quadArr2)
      console.log(allQuads);
      this.setAverageStats(allQuads);
    }

  }

  @Action
  async fetchAthleteInfo({ uri }: { uri: string }) {
    const payload = { s: uri };
    const resp = await useRecipe("athlete/info", payload);
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    console.log(quadArr)
    this.setAthleteInfo(quadArr);
  }

}

export default getModule(AthletesModule);
