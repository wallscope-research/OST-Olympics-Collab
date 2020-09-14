
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

export const sportsMap: { [key: string]: string } = {
  "Wrestling": "http://wallscope.co.uk/resource/olympics/sport/Wrestling",
  "Weightlifting": "http://wallscope.co.uk/resource/olympics/sport/Weightlifting",
  "Water Polo": "http://wallscope.co.uk/resource/olympics/sport/WaterPolo",
  "Volleyball": "http://wallscope.co.uk/resource/olympics/sport/Volleyball",
  "Tug-Of-War": "http://wallscope.co.uk/resource/olympics/sport/TugOfWar",
  "Triathlon": "http://wallscope.co.uk/resource/olympics/sport/Triathlon",
  "Trampolining": "http://wallscope.co.uk/resource/olympics/sport/Trampolining",
  "Tennis": "http://wallscope.co.uk/resource/olympics/sport/Tennis",
}
export class Sport {

  name: string

  constructor(name: string) {
    this.name = name;
  }
}

@Module({ dynamic: true, namespaced: true, name: "sportsM", store })
class SportsModule extends VuexModule { }

export default getModule(SportsModule);
