import axios from "axios"


export function makeURI(name: string, type: "athlete" | "sport" | "continent") {
  const uriMap = {
    "athlete": "http://wallscope.co.uk/resource/olympics/athlete/",
    "sport": "http://wallscope.co.uk/resource/olympics/continent/",
    "continent": "http://wallscope.co.uk/resource/olympics/sport/"
  }

  const fixedName = name.replace(/-|\s/g, "");

  const ret = uriMap[type] + fixedName;

  return ret;
}

export async function useRecipe(recipe: string, params: any) {
  const { data } = await axios.get('api/enhance/' + recipe, { params });
  return data
}