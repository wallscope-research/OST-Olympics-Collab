import axios from "axios"



//ADD VALID RECIPE NAMES HERE!
const recipes = ["related", "medals-per-age", "athlete/info", "average/stats", "athlete/medals", "text/related"]


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

export async function useRecipe(recipe: string, payload: any) {

  if (!recipes.includes(recipe)) {
    throw new Error("Recipe name not valid. Please check again!")
  }
  console.log("payload is", payload)
  const { data } = await axios.get(
    'api/enhance/' + recipe,
    {
      params: payload
    });
  return data
}