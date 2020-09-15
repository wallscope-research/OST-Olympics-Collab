
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

export const continentMap: { [key: string]: string } = {
  Africa: "http://dbpedia.org/resource/Africa",
  Asia: "http://dbpedia.org/resource/Asia",
  "North America": "http://dbpedia.org/resource/North_America",
  "South America": "http://dbpedia.org/resource/South_America",
  "Europe": "http://dbpedia.org/resource/Europe",
}
@Module({ dynamic: true, namespaced: true, name: "continentM", store })
class ContinentsModule extends VuexModule { }

export default getModule(ContinentsModule);
