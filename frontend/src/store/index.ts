import Vue from 'vue';
import Vuex from 'vuex';
import * as n3 from "n3";

Vue.use(Vuex);

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

export class Sport {
  uri: string
  name: string;
  season?: string;
  medalCount?: number;
  athleteCount?: number;
  constructor(uri: string, name: string, season?: string, medalCount?: number, athleteCount?: number) {
    this.uri = uri;
    this.name = name;
    this.season = season;
    this.medalCount = medalCount;
    this.athleteCount = athleteCount;
  }
}

export class Athlete {
  uri: string;
  name: string;
  sport?: Sport;
  height?: number;
  weight?: number;
  sex?: string;
  medals?: number;
  continent?: string;
  team?: string;
  age?: number;

  constructor(uri: string, name: string, team?: string, sport?: Sport, height?: number, weight?: number, sex?: string, medals?: number, continent?: string, age?: number) {
    this.uri = uri;
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
    const sportQuad = graph.getQuads(null, predMap.sport, null, defaultG).find(x => !!x)
    const uri = sportQuad!.subject
    const name = graph.getObjects(uri, predMap.name, defaultG).find(x => !!x)!.value;
    const weight = +graph.getObjects(uri, predMap.weight, defaultG).find(x => !!x)!.value;
    const sportLabel = graph.getObjects(sportQuad!.object, predMap.name, defaultG).find(x => !!x)!.value
    const team = graph.getObjects(uri, predMap.team, defaultG).find(x => !!x)!.value;
    const continent = graph.getObjects(uri, predMap.continent, defaultG).find(x => !!x)!.value;
    const gender = graph.getObjects(uri, predMap.gender, defaultG).find(x => !!x)!.value;
    const medals = +graph.getObjects(uri, predMap.medals, defaultG).find(x => !!x)!.value;
    const height = +graph.getObjects(uri, predMap.height, defaultG).find(x => !!x)!.value;
    const age = +graph.getObjects(uri, predMap.age, defaultG).find(x => !!x)!.value
    return new Athlete(uri.id, name, team, new Sport(sportQuad!.object.id, sportLabel), height, weight, gender, medals, continent, age)
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
    try {
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
    } catch (e) {
      return new Averages()
    }
  }
}

export type DataTag = { uri: string; text: string };
export type DataArticle = { date: Date | null; title: string; url: string; tags: DataTag[] };
export type SearchResult = { uri: string, type: string, label: string, score: number };

export default new Vuex.Store({});
