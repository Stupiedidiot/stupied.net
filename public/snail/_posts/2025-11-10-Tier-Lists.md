---
title: Automating My Tier Lists
thumbnail: /blog/img/25/tier-list.jpg
header: /blog/img/25/tier-list.jpg
tags:
  - spaghetti
  - jekyll
  - obsidian
description: Wanting to watch every single animated Disney media, I figured it be a good idea to make a tier list for them.
---

It all began in when youtube started recommending me the channel [West of Neverland](https://www.youtube.com/@WestofNeverland/). The videos led me to remember the existence of Ducktales (2017). After re-watching the show I began developing a fascination of Donald Duck. On thing led to another which eventually snowballed into me wanting to watch every single Animated Disney Film and Short. It felt wrong immediately consuming one media after another so I thought it be neat to write my feelings of each piece - maybe even research and learn some obscure Disney history.

A single page with nothing but paragraphs of text didn't feel all that fulfilling to me. There needed to be a visual representation of the films I had watched and how I felt about it. Then the solution came to me in a form of a [Tier List](https://en.wikipedia.org/wiki/Tier_list). For the uninitiated, a tier list is basically a categorical rating system. So S Tier would be the bestest of the best and F Tier will the opposite of that. Prior to this, I've always thought tier lists were dumb and too ambiguous (they are) but that simplicity is what makes it a really good shorthand to show hierarchy. So welcome back to another blog post where I explain random stuff no one asked about. Today we will be going about how I went about making my tier list.

## Heads Up!
Once again, this blog post is by no means a tutorial. The code is oversimplified and a lot of information is omitted for the sake of brevity. I apologize in advance because this blog is kinda all over the place. Alrighty, let's just begin! 

## Using Jekyll Collections
The static site generator I use, [Jekyll](https://jekyllrb.com/), allows you to group files into [Collections](https://jekyllrb.com/docs/collections/). This organizes the files and let's you access them for loops. All we gotta do is make a folder called like `_reviews` then list it to my `config.yml` file like so:
```yaml
collections:
    - reviews
```

In the aforementioned folder we can add markdown files which then lists them as an item in that collection. At the beginning of each file we can set the [Front Matter](https://jekyllrb.com/docs/front-matter/). They're basically the files properties we can use to sort with.
```yaml
title: Blame It on the Samba
reviewed: 2030-01-01
release: 1948
tier: S
```

Most of it should be self explanatory but here's what each property.
- `title` - Set Title
- `reviewed` - The Date I wrote the review
- `release` - Year film was released
- `tier` - The ranking

If you're wondering why the review date is written before the release date, it's only because I have this weird thing about lists widths and how they're arranged. Either way, it doesn't really matter in what order you declare these variables. Also they are all completely optional. We can access all the files in the `_reviews` folder by typing `site.reviews`. It returns an array that we can get the front matter from. Now let's get to actually using those properties!

## Getting the Title n Image Links
Just like in my [Art Archive](2025-10-11-Art-Archive) I can't be bothered to manually typing every title. So when the titled isn't specified we just default to the `filename`. Additionally I'd like to be able to put the movie's release date by the side. This is particularly helpful considering Disney's track record of making remakes. Everything is stored in a `capture` variable that basically saves everything inside it as a string.

The code below would output something like: `Blame It on the Samba (1948)`. We can use it by simply typing `{% raw %}{{ title }}{% endraw %}`
```liquid
{% raw %}{%- capture title -%}
    {{ item.title | default: item.filename }}

    {% if item.release %}
        <!-- Adds the year it was released in -->
        ({{ item.release }})
    {% endif %}
{%- endcapture -%}{% endraw %}
```

Because I don't want to manually assign a thumbnail for each item, the image is just the slugify-ied title with a `.jpg` extension.
```liquid
{% raw %}<img src="img/{{ item.slug | downcase }}.jpg" alt="thumbnail for {{ title }}">{% endraw %}
```

## Filtering n Sorting Files
Before we can make out tier list,  we need to get a filtered array of items in a specific category and tier. We achieve this by grouping stuff inside folders. So if we want to make a tier list of only Disney media, We'll make a new folder in `_reviews` called `disney` where we'll put all my markdown files in. Then we use `where_exp` to filter out items that aren't inside that folder. Then we sort it by the movies release date, just because why not!
```liquid
{% raw %}{%- assign REVIEWS = site.reviews | where_exp: "item", "item.path contains include.selected" | sort: "release" -%}{% endraw %}
```

What's neat about this is we can sorta nest things. Let say we want to separate feature length films from shorts. We also want to keep track of anything Donald Duck, so we add a `donald` folder to each separate folders like so:
```console
disney
    ├───films
    │   └───donald
    └───shorts
        └───donald
```

Not sure how to explain this in paragraph form so I hope the thing below does it for me. Basically, for a narrower result I just have to specify more folders.
```
contains 'disney/'        → returns everything in disney folder
contains 'donald/'        → returns anything inside a donald folder
contains 'films/donald/'  → returns files from donald folder only when inside films folder
```

If we want to get only items of a specific tier, we just use newly filtered array and filter them with `where`.
```liquid
{% raw %}{%- assign filtered = REVIEWS | where: "rating", S -%}{% endraw %}
```

## Actually Making the Tier List
With all the files filtered and sorted, we can now start actually making the thing! We basically have to loop through every item in the filtered array like so:
```liquid
{% raw %}<div class="tier-items">
    {%- assign filtered = REVIEWS | where: "rating", S -%}
    {%- for item in filtered -%}
        <img src="img/{{ item.slug | downcase }}.jpg" alt="thumbnail for {{ title }}">
    {%- endfor -%}
</div>{% endraw %}
```

We just have to do that for the 6 other tiers. Because I am lazy, instead of manually copy and pasting the code above, we will be utilizing a script that will automatically do it for me. First we have a string of all the tiers needed and split it up into an array. Then we loop through the tiers and once again filter our list for that specific tier.
```liquid
{% raw %}{%- assign TIERS = "S,A,B,C,D,E,F" | split: "," -%}
<article class="tier_list">
    {%- for tier in TIERS -%}
    <section class="{{ tier }} tier">
        {%- assign filtered = REVIEWS | where: "rating", tier -%}
        <div class="tier-label"><span>{{ tier }}</span></div>
        <div class="tier-items">
            <!-- This is referencing the code above  -->
            {%- include tier-item.html selected = selected -%}
        </div>
    </section>
    {%- endfor -%}
</article>{% endraw %}
```

Then just like that we now have a the tier list! You can do other stuff as well such as wrapping the images in buttons that opens up a modal or even allow for custom tiers by changing the `TIER` variable's values. Those are pretty simple to implement. I trust you all to be smart enough to do a better job than me haha,,,

![Preview of the Result](img/25/tier-list.jpg)

## List Most Recently Reviewed
Not everything ranked will have a review written. So I thought it be nice to have a small feed in the bottom that shows most recently uploaded reviews. This can be achieved by chucking the unfinished reviews into a `todo` folder then filtering them out. 

The problem is that `where_exp` can't do `item contains '/todo' == false` for some reason. So instead I'll have to loop through the array to filter out anything that's in the `todo` folder.

```liquid
{% raw %}{%- assign REVIEWS_RAW = site.reviews
    | where_exp: "item", "item.path contains include.selected"
    | sort: "reviewed"
    | reverse
-%}

<!-- This initializes the array -->
{%- assign reviews_recent = "" | split: ""-%}
{%- for item in REVIEWS -%}
    {%- unless item.path contains 'todo/' -%}
        {%- assign reviews_recent = reviews_recent | push: item -%}
    {%- endunless -%}
{%- endfor -%}{% endraw %}
```

## Random Things
If you've been keeping track of my [Listography](/about/listography) page, you may notice there is a Disney watchlist. The list data is stored in a json file. It's a multidimensional array, with the first string marking whether or not I finished it and the other with the name of the film. It kinda looks like this:
```json
["X", "Saludos Amigos"],
["X", "The Three Caballeros"],
[" ", "A Goofy Movie"],
```

For it to display as a checklist, I just loop through that array and format it like so.
```liquid
{% raw %}{% for movie in site.data.lists.watchlist %}
- [{{ movie[0] }}] {{movie[1]}}
{% endfor %}{% endraw %}
```
![Watchlist Button](img/25/watchlist-button.png){:style="max-width:280px;"}{:class="float-left"}

You may wonder, why bother going through all this trouble? Well it's because I can use this data to see which films I haven't watch and have a button to randomize what I should watch next. Just made a js array that lists all unwatched films then coded a button that displays a random item from that array!

<hr class="clear">

## Editing With Obsidian
**2025/11/22 »** Henlo, small update! Recently been messing around with [Obsidian's](https://obsidian.md/) and it's feature to sort files with [Bases](https://help.obsidian.md/bases). With it we can make a catalog of the of all my files. To do so we first head over to the collections folder, which in this case is the `_reviews`, then turn it to an obsidian vault. Also add `.obsidian` to the `gitignore` while you're at it. Here we can start a new base with the card view.

To set a thumbnail we make a new property with the formula below. It just grabs the filename and append the `.jpg` extension.

```js
image("img/" + file.name.lower() + ".jpg")
```

Then just like that we're done! This is just a really neat feature and it's nice to have a visual preview of the stuff I've review, juxtapose manually building the website every time I need to see new changes. Technology is so awesome you guys, like seriously.

![Obsidian Base of Tier List Items](img/25/tier-list-obsidian.jpg)

## The End
Okay that's all!! Sorry if this post structure weirdly. I highly doubt anyone will find any of this useful but it was fun to write. It only been like 3 months since I started using Jekyll and it feels like there's a lot more I can do. Join us next time when I figure out how to use actually use Ruby and make custom plugins!!