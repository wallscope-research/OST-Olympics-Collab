import axios from "axios"

export interface parameters {
  text?: string;
  s?: string;
  o?: string;
  p?: string;
  s2?: string;
  o2?: string;
  p2?: string;
}

//ADD VALID RECIPE NAMES HERE!
const recipes = ["related", "medals-per-age", "athlete/info", "average-stats"]


export function makeURI(name: string, type: "athlete" | "sport" | "continent") {
  const uriMap = {
    "athlete": "http://wallscope.co.uk/resource/olympics/athlete/",
    "sport": "<http://wallscope.co.uk/resource/olympics/continent/",
    "continent": "<http://wallscope.co.uk/resource/olympics/sport/"
  }

  const fixedName = name.replace(/-|\s/g, "");

  const ret = uriMap[type] + fixedName;

  return ret;
}

export async function useRecipe(recipe: string, payload: parameters) {

  if (!recipes.includes(recipe)) {
    throw new Error("Recipe name not valid. Please check again!")
  }
  const { data } = await axios.get(
    'api/enhance/' + recipe,
    {
      params: payload
    });
  return data
}