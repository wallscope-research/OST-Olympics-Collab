
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
import { parameters } from "@/utils/hiccupConnector"

const predMap: { [key: string]: string } = {
  weight: "http://dbpedia.org/ontology/weight",
  continent: "http://wallscope.co.uk/ontology/olympics/hasContinent",
  team: "http://dbpedia.org/ontology/team",
  sport: "http://wallscope.co.uk/ontology/olympics/sport",
  medals: "http://wallscope.co.uk/ontology/olympics/medalCount",
  gender: "http://xmlns.com/foaf/0.1/gender",
  name: "http://www.w3.org/2000/01/rdf-schema#label",
  height: "http://dbpedia.org/ontology/height"
}
export class Athlete {
  name: string;

  sport?: Sport;
  height?: number;
  weight?: number;
  sex?: string;
  medals?: number;
  continent?: string;
  team?: string

  constructor(name: string, team?: string, sport?: Sport, height?: number, weight?: number, sex?: string, medals?: number, continent?: string) {
    this.name = name;
    this.sport = sport;
    this.height = height;
    this.weight = weight;
    this.sex = sex;
    this.medals = medals;
    this.continent = continent
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
    return new Athlete(name, team, new Sport(sport), height, weight, gender, medals, continent)
  }
}


@Module({ dynamic: true, namespaced: true, name: "countriesM", store })
class AthletesModule extends VuexModule {

  athlete: Athlete = { name: makeURI("Jessica Phyllis Ennis-Hill", "athlete") };
  graph = new n3.Store();
  athleteInfo: n3.Quad[] = []

  get getGraph() {
    return this.graph;
  }

  get getAthlete() {
    return this.athlete
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

    // console.log(quadArr);
    const defaultG = new n3.DefaultGraph();
    this.athlete = Athlete.fromRDF(new n3.Store(quadArr));
    // console.log(this.graph);
    // const codeQuads: n3.Quad[] = this.graph.getQuads(
    //   this.athlete.name,
    //   null,
    //   null,
    //   defaultG
    // );
    // codeQuads.map(s => {
    //   //@ts-ignore

    // })

    console.log(this.athlete)


  }

  @Action
  async fetchAthleteInfo({ name }: { name: string }) {
    const payload: parameters = { s: name };
    const resp = await useRecipe("athlete/info", payload);
    const parser = new n3.Parser();
    const quadArr = parser.parse(resp);
    console.log(quadArr)
    this.setAthleteInfo(quadArr);
  }

}

export default getModule(AthletesModule);
