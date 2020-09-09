# Queries

Just a quick list of the query files and descriptions.

## Athlete View

ath1.rq - Returns ages with the average number of medals that athletes at each age has. This populates the bar chart.  
ath2 (a and b) - Populates the parallel coordinates plot (with sport and continent dropdowns). Athlete stats come from `ath3.rq`.  
ath2a.rq - Returns AVG weight, height, and age of all athletes (can be filtered by sport and continent with dropdowns).  
ath2b.rq - Returns AVG number of medals of all athletes (can be filtered by sport and continent with dropdowns).  
ath3.rq - Returns info about selected athlete. This populates infobox and both charts!  

## Sport View

sport1.rq - Number of medals and athletes per continent over time (using time slider!), given a {{sport}}. This populates the bar charts.  
sport2.rq - Returns AVG athlete stats (age, height, weight) per sex over time, given a {{sport}}. This populates the three line charts.  
sport3.rq - Returns top 5 athletes in {{sport}} (based on medal count) per sex. This populates both athlete lists.  
sport4.rq - Populate the Sport view infobox, given a {{sport}}.  

## Continent View

con1 (a, and c) - Populates the parallel coordinates plot (with sport and sex dropdowns). These two populate global line.  
con1 (b, and d) - Populates the parallel coordinates plot (with sport and sex dropdowns). These two populate continent specific line.  
con1a.rq - Return all athlete stats (age, height, weight). Can be filtered by sport and sex using dropdowns.  
con1b.rq - Return all athlete stats (age, height, weight) for the selected {{continent}}. Can be filtered by sport and sex using dropdowns.  
con1c.rq - Return mean number of medals an athlete has globally. Can be filtered by sport and sex using dropdowns.  
con1d.rq - Return mean number of medals an athlete has, that represents a countrly in the selected {{continent}}. Can be filtered by sport and sex using dropdowns.  
con2.rq - Number of medals and athletes over time. Given a {{sport}} (chosen in dropdown), we can see a regions rise to dominance in the line chart.  
con3.rq - Populate the Continent view infobox, given a {{continent}}.  