
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


@Module({ dynamic: true, namespaced: true, name: "countriesM", store })
class ContinentsModule extends VuexModule { }

export default getModule(ContinentsModule);
