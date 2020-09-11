
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


export class Sport {

  name: string

  constructor(name: string) {
    this.name = name;
  }
}

@Module({ dynamic: true, namespaced: true, name: "sportsM", store })
class SportsModule extends VuexModule { }

export default getModule(SportsModule);
