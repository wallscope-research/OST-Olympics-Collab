export const athleteTexts: { [key: string]: { description: string, source: string } } = {
  infoBox: {
    description: "This is an overview of an athlete’s attributes.",
    source: `This information is sourced from ` + `Kaggle`.link("https://www.kaggle.com/heesoo37/120-years-of-olympic-history-athletes-and-results") + `. We transformed the tabular dataset into a knowledge graph and then created rules to deduce additional information from that graph. For example, we used the age and year at which an athlete won their first medal to calculate their current age today.

The dataset does not contain any death information. If the selected athlete has passed away, the age reflects how old they would be if still alive today.

There is one bug in the original Kaggle dataset that affects a few athlete’s names. We have `+ `reported the bug (examples included in report)`.link("https://www.kaggle.com/heesoo37/120-years-of-olympic-history-athletes-and-results/discussion/185670") + ` and will update when resolved.
`
  },
  medalsByAge: {
    description: "This chart displays the mean number of medals Olympic athletes have, grouped by age.",
    source: `Most Olympians do not win any medals, hence the low averages.

    It is also important to note that we are using the athlete’s current age here, not the age at which they won a medal (as athletes win multiple medals at different ages). Therefore, the mean can decrease as age increases (e.g. if more athletes are currently at that age).
    `
  },
  statistics: {
    description: "Here we compare an athlete to the ‘average Olympian’. Using the filters, you can compare an athlete to a more specific group. For example, the average Asian swimmer.",
    source: `We use a group of rules here to aggregate athlete’s statistics at different levels of specificity (for the filters). This is done incrementally as new athletes are added, only updating the aggregated statistics where appropriate. We can therefore report accurate information very quickly. More details can be found in this article alongside finance and healthcare example applications.
    `
  }
}

export const sportTexts: { [key: string]: { description: string, source: string } } = {
  infoBox: {
    description: "This is an overview of a sport’s stats.",
    source: `This information is sourced from ` + `Kaggle`.link("https://www.kaggle.com/heesoo37/120-years-of-olympic-history-athletes-and-results") + `. We transformed the tabular dataset into a knowledge graph and then created rules to deduce additional information from that graph.`
  },
  topFemales: {
    description: "These are the top five female athletes for the given sport, ordered by total medal count.",
    source: `One of our data-sources listed each instance that a medal was won at the Olympics. We created a rule to count these instances and link each athlete to their ‘total medal count’. Therefore, to find our top athletes, we can be efficient and do not need to query over every single instance in the original knowledge graph.
    `
  },
  topMale: {
    description: "These are the top five male athletes for the given sport, ordered by total medal count.",
    source: `One of our data-sources listed each instance that a medal was won at the Olympics. We created a rule to count these instances and link each athlete to their ‘total medal count’. Therefore, to find our top athletes, we can be efficient and do not need to query over every single instance in the original knowledge graph.
    `
  },
  medalsPerContinent: {
    description: "In this chart we first illustrate the number of medals won by each continent in the selected sport. To the right of this, we show the number of athletes that represented each continent. The slider below the chart lets you glide through the years and see how these figures changed over time.",
    source: `We used both our original knowledge graph and transformed tabular dataset to create this chart. In addition, we developed some rules to reason across these two sources and build new “participation” entities which were core to the SPARQL query. For more information about this, you can read the article here.`
  },
  ageOverTime: {
    description: "This depicts this sport’s variation in athlete’s age over time.",
    source: `Using our integrated graph representation of our data sources, this requires a simple SPARQL query.`
  },
  heightOverTime: {
    description: "This depicts this sport’s variation in athlete’s height over time.",
    source: `Using our integrated graph representation of our data sources, this requires a simple SPARQL query.`
  },
  weightOverTime: {
    description: "This depicts this sport’s variation in athlete’s weight over time.",
    source: `Using our integrated graph representation of our data sources, this requires a simple SPARQL query.`
  },
}

export const continentTexts: { [key: string]: { description: string, source: string } } = {
  infoBox: {
    description: "This is an overview of a continent's stats.",
    source: `This information is sourced from ` + `Kaggle`.link("https://www.kaggle.com/heesoo37/120-years-of-olympic-history-athletes-and-results") + `. We transformed the tabular dataset into a knowledge graph and then created rules to deduce additional information from that graph.`
  },
  medalsAndAthletesOverTime: {
    description: "This chart displays both how many athletes represented the continent, and how many medals the continent’s athletes won, over time. This can be filtered by sport.",
    source: `We used both our original knowledge graph and transformed tabular dataset to create this chart. In addition, we developed some rules to reason across these two sources and build new “participation” entities which were core to the SPARQL query. For more information about this, you can read the article here.`,
  },
  statistics: {
    description: "Here we compare a continent to the ‘average Olympian’. Using the filters, you can compare a continent to a more specific group. For example, the average Asian swimmer.",
    source: `We use a group of rules here to aggregate athlete’s statistics at different levels of specificity (for the filters). This is done incrementally as new athletes are added, only updating the aggregated statistics where appropriate. We can therefore report accurate information very quickly. More details can be found in this article alongside finance and healthcare example applications.`,
  },
}

export const allTexts: { [key: string]: { description: string, source: string } } = {
  news: {
    description: "This panel contains Reddit submissions related to the pages contents. These submissions are all from r/olympics (a subreddit) during several of the past Olympic games (London 2012 to PyeongChang 2018).",
    source: `Reddit’s r/olympics community was much smaller pre-2012 so historical athlete’s may not have any posts about them.

    Using Wallscope’s Platform, we processed the Reddit texts which created a knowledge graph representing the submissions and their content. We then map this graph to the core entities and display related news.`,
  },
} 