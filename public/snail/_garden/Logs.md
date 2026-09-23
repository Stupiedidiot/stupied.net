---
index: 3
date: 2026-09-09T09:53
title: Habit Tracker
description: Using daily notes to track habits.
category: meta
tags:
render_with_liquid: false
---
I've struggled with physical habit trackers because they simply don't feel as satisfying to maintain. Keeping a digital tracker is neat because you get to transform that data to whatever you like. So I put one together using Obsidian's built in Daily Notes feature and some javascript. Also, because of how many hobbies I have, it be unrealistic to force myself to do each one everyday. So instead each habit is categorized into more broader topics! You can view what those are over [here](/logs/).

## Obsidian
Obsidian already has daily notes built in. So I just set the format for the filename and let it point to a file to use it as a template. the file's front matter has a `date` property that will automatically added in. Then I have the properties of the habits I want to keep track of. Obsidian will render that property as a checkbox I can click to toggle it on and off. 

```yaml
---
date: {{date:YYYY-MM-DD}}
drawing: false
text:  false
read: false
---
```

Then I just have to open up the command palette, mine is set up as `ctrl+shift+p`, and select "Daily notes: Open today's Daily Note". It opens up the note for that day and makes one if it doesn't exists yet.

## Jekyll
Inside my config file I have a collection called `log` set. Don't have to configure anything else. As a side tangent, the folder that the index file was originally gonna be called "log", but some Jekyll freaks out and refuses to rebuild it incrementally.
```yaml
# It literally just looks like this
collections:
  log:
```

The navigation is going to be done using Javascript because I don't want to make individual static pages for each month. So in Jekyll, we will just be looping through `site.logs` to make a json file to read off of. Inside a file called `main.json`, I want to have an object that has the years as properties. Then those years objects with their own properties for the months. Then those months will have an array containing the days. The days are objects with necessary properties. By the end of this we should have something that looks like this:

```json
{
    "2026": {
            "9": [
                {
                    "date": "September 1, 2026",
                    "day": "1",
                    "url": "/log/2026-09-01.html",
                    "crafted": true,
                    "wrote": true,
                    "played": true,
                    "text": "<p>Insert Yapping</p>\n"
                }
            ]
    }
}
```

Using the `group_by_exp` we can group all entries by year. This filter will return array. Each item has  `name`  and `items` property. The former is the label and the latter stores an array of the items that fit the filter for that particular label.
```liquid
{% assign DATA = site.log | group_by_exp: "e", "e.date | date: '%Y'" %}
```

Then for each year in `DATA` we can group entries by month. Then loop through each day.
```liquid
{% for year in DATA %}
	<!-- Sort items by month -->
	{% assign months = year.items | group_by_exp: "e", "e.date | date: '%-m'" %}
	
	{% for month in months %}
		<!-- loop through months and thier -->
		{% for day in month.items %}
		<!-- loop through all entries of month -->
		{% endfor %}
	{% endfor %}
{% endfor %}
```

Then we manually add an if statement that checks whether or not at least one task for each property has been done. Usually putting the task most likely to be done in the start of the if statement.  "That's not scalable!!!" and you'd be right.
```liquid
{% if day.drawing or day.crochet %}
	,"crafted": true
{% endif %}

{% if day.code or day.text or day.notes %}
	,"wrote": true
{% endif %}

{% if day.read or day.piano or day.exe %}
	,"played": true
{% endif %}
```
## Javascript
First things first, we need to check what year and month to render. It should be defined in the url parameters `y` and `m`. If neither of those are defined we just use the current year and month instead.
```js
const DATE_CURRENT = new Date();
const QUERY = new URL(window.location.href);

if (QUERY.searchParams.has('y')){
    year = parseInt(QUERY.searchParams.get('y'));
} else {
    year = DATE_CURRENT.getFullYear();
}

if (QUERY.searchParams.has('m')){
    month = parseInt(QUERY.searchParams.get('m'));
} else {
    month = DATE_CURRENT.getMonth();;
}
```

Then we can make the calendar itself with loops and grids. Each day is given an ID to call back to.

```js
for (let i = 1; i <= DATE_SELECTED.getDate(); i++) {
    let el = document.createElement('li');
    el.id = "day-" + i;

    let label = document.createElement('span');
    label.className = 'calendar-date';
    label.textContent = i;
    
    el.append(label);
    add_to_cal(el);
}
```

```js
fetch("main.json")
    .then((response) => response.json())
    .then((data) => {
	    // checks if the property exists
        if (data[year] && data[year][month + 1]){
            days = data[year][month + 1];
            for(const day of days){
	            // loops through each day.
	            // add the needed info to each day by calling their id. 
            }
        }
    }
)
```

## Conclusion
This calendar has encourage me to engaged with my hobbies more often! Also it kinda works well as a microblog. I like how my yapping can be buried by time lol.