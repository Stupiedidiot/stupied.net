---
title: Using Obsidian for Art Archive
description: Updating how I store info for my Art Gallery
thumbnail: /blog/img/26/art-base-card.jpg
render_with_liquid: false
before: <img src="/blog/img/26/art-base-card.jpg" alt="">
tags:
  - spaghetti
  - jekyll
  - obsidian
---

As mentioned in a previous [blog post](2025-10-11-Art-Archive), my art is stored in a yaml file. Which means whenever I want to add a new artwork, I'd have to manually type it to the top of the list then build my website to see whether it has been written down correctly. This process is slow, tedious, and an indent away from fucking over. It basically discourage me from adding too much info about a piece; Instead opting for shorter sentences. Which is a shame since I want my art posts to be more akin to [Ember's Art Log](https://sachersketchbook.neocities.org/) Where I could ramble more in depth about the rationale of some pieces. But the process of sifting through a 4800+ line text file is cumbersome... If only I could separate them into their own files... Hey, isn't that what Jekyll [Collections](https://jekyllrb.com/docs/collections/) are for??

So yeah, today will be going through how I went about reworking the system for my art and how I use [Obsidian](https://obsidian.md/) with it. As per usual, **NOT A TUTORIAL.** Only for entertainment :3

## Refresher
Whenever I wanted to add a new art piece, I would have to open my `art.yaml` file to encode the following.

- `img` - the filename
- `date` - when art is posted
- `title` - specific title, overrides default
- `desc` - caption for the art
- `extra` - additional images 
- `tags` - keywords to categorize art

Each item generally looks like this:
```yaml
- img: 26/doodle/Dresses.jpg
  date: 2026-01-29
  title: Dresses from Childhood
  desc: Letting my OCs wear outfits I've long outgrown. Also was listening to this wonderful [performance](https://youtu.be/2olBE4C5_Gk) while making this :]
  tags:
  - ocs
  - digital
  - mary
  - psych
```

Yes, I write strings without wrapping around quotations marks. Yes, it has caused me problems. No, I will not reform and pent for my sins. Anyways, you may notice, the `img` is a path. This path is relative to folder that keeps the images. It kinda acts like a identification. So that I can have two files of the same name but in different folders. Also, I like to derive more tags from it, which you will all see in a while.
## Convert to Markdown
 Although I don't doubt the possibility of someone making an extension for Obsidian to read and write json files, I'd rather not try to battle the app into something it wasn't optimized to do. So the first step is to convert each array item into a markdown file with all the necessary frontmatter.  Instead of using an actual program to do this, I decided just made a separate Jekyll website to process it. In order for this to work, I used my modified version the [Data Pages Generator](https://github.com/avillafiorita/jekyll-datapage_gen/) plugin. I also temporarily removed the `downcase` function in the sanitizer so I can retain the original casing of the `img` property.
 
```yaml
source: public
destination: draft

page_gen:
  - data: 'site.data.art'
    template: 'art-to-md'
    name_expr: "record['img'].split('/').last.split('.').first"
    extension: 'txt'
    dir_expr:  "record['img'].split('/')[0...-1].join('/')"
    page_data_prefix: 'prop'
```

This might look incredibly intimidating but it really isn't. So let me try to break down what each property does.

- `data` - Points to my `art.yaml` and tells the script to iterate each item in that list.
- `template` - Tells the script to use that particular layout to output each item in the list. This is where I can format the information.
- `name_expr` - Tells the script what each file should be named. It is derived from popping the `img` property and removing the file extension.
- `extension` - Tells the script what the extension of each generated file should be. It is set to `txt` otherwise Jekyll will render my `desc` properties in html tags. We will just have to rename the extension after the pages are generated.
- `dir_expr` - Tells the script what folder the file should be in. This is a property I personally added in. Go use the ruby file in this [fork](https://github.com/Stupiedidiot/jekyll-datapage_gen) if you want to use it.
- `page_data_prefix` - In order to access the item data in the layout, we just type a liquid tag with `page.desc`. This is fine until we conflict with a predefined property Jekyll automatic makes, such as `page.title`. So, to access the properties only we made, I added the prefix. So we'd need to write `page.prop.desc` instead.

### The Template
This is the layout used by the script for each item in the array. The first two lines of dashes is the templates actual frontmatter. The dashes that follows after it, is the start of the frontmatter of file I want to have.
```liquid
---
---
---
ext: {{ page.prop.img | split: '.' | last }}
date: {{ page.prop.date }}

{%- if page.prop.title %}
title: {{ page.prop.title }}
{% endif %}

{%- if page.prop.extra %}
extra:
{% for e in page.prop.extra -%}
- img: {{ e }}
  alt: 
{% endfor -%}
{% endif %}

tags:
{% for e in page.prop.tags -%}
- {{ e }}
{% endfor -%}
---

{{ page.prop.desc }}
```

Since the file location and name is already `img` property, we need to set the `ext` property to keep track of what the images file type is. Then the `desc` property is the the contents of the markdown :D

#### The Output
The example I gave at the start will look like this in markdown form!
```
---
ext: jpg
date: 2026-01-29
title: Dresses from Childhood

extra:
tags:
- ocs
- doodle
- digital
- mary
- psych
---

Letting my OCs wear outfits I've long outgrown. Also was listening to this wonder [performance](https://youtu.be/2olBE4C5_Gk) while making this :]
```
### Building Website
So with everything in place, we just have to generate each file, move the output to my actual website, and rename the text files. I anticipated the need to do this a few more times, such as when archiving a bunch of older art, so I decided to make a batch file for it.

```
call bundle exec jekyll clean
call bundle exec jekyll build
for /R "%~dp0draft" %%x in (*.txt) do ren "%%x" "%%~nx.md"
pause
```

After cleaning and building the website. It recursively goes through the `draft` folder, which is destination of my output. It renames all the text files into markdown files that I can move to be used for my collection!

## Obsidian Vault
In my website's config files, I have this property set.

```yaml
collections_dir: snail
```

It basically tells Jekyll all my collection files are inside that particular folder, which we will be using as the Obsidian vault.  We set up the collections like so.

```yaml
collections:
  art: 
    output: true
    permalink: /art/p/:path
  img:
    output: true
    permalink: /:path
```

The `art` collection is where I keep markdown files I made. The output is set to true because I want to make individual pages for each piece, for reasons I'll explain later. Then the `img` collection stores all my images. We need to keep them inside the vault to save us some headaches. I like to use it for my blog as well. So the `_img` folder kinda looks like this rn.

```
├───art
│   └───img
│       ├───24
│       ├───25
│       └───26
└───blog
    ├───img
    └───micro
        └───img
```
### Bases
Obsidian [Bases](https://obsidian.md/help/bases) is a pretty neat of viewing all your markdown files, and is reason why I chose it. We can make custom formulas to set as thumbnails or for filtering. It's really cool!!! Instead of running the `jekyll build`, I could just open the base to see if the art piece is added correctly.

#### Formulas
You can use formulas to make custom attributes to use for filtering and what not. This is what I use to set the thumbnail for the view.
```
image(
	"/_img/art/img/" +
	file.path.split('/').slice(1).join('/').split('.')[0] +
	'.' + note.ext
)
```
#### Card View
![Art base in the card view](img/26/art-base-card.jpg)
This view is for skimming over my art. When I remember something funny, I can open up the file and write it down.
#### Table View
![Art base in the card table view](img/26/art-base-table.jpg)
This view is for adding more information. Hoping it will get me to finish writing the alt text for... *checks notes*... all 700+ images.

### Adding Art
Also, to save me the trouble of manually going through a folder to create a markdown file, I use [Quick Add](https://github.com/chhoumann/quickadd) to make a new file in the current year folder with a template. 
## Jekyll Shenanigans
Aside from the removal of the `img` property, the information in the frontmatter are more or less the same. In Jekyll, looping through a yaml file isn't that different from a collection. There are a few things I found noteworthy though. Jekyll assigns a titles automatically so instead of having a function to do it, I literally just have to type `{{ item.title }}`.

Then there's the description. Back then I would just have an if statement checking if the `desc` property was assigned. But now, since the description is the pages content, it's always true! Even if that content is just a line break. So in order to check if there really is a description, I have to to strip the content and see if it's an empty string.
```liquid
{% assign test = e.content | strip %}
{%- if test != '' -%}
	{{ e.content }}
{%- endif -%}
```
### Next and Previous
The reason why I'm choosing to generate a page for each art file is because I like to romanticize the idea of this website outliving me. Part of that fantasy is minimizing my Javascript usage. I want my website to be archived in the shittiest conditions and still be navigable. Also, dealing with url query strings are annoying when you have comment systems relying on it. I'd rather have my comment system check the url path, so I can save the query strings to do more funky stuff. Maybe have a script that will update the next and prev buttons based on what tag a user is viewing.

In order to get the files for the next and previous images, I'll have to loop through the collection and find the one with a matching path.
```ruby
def getArtNxtPrv(input, target)
  idx = nxt = prv = nil
  input.each_with_index do |e, i|
	if ( e.relative_path == target )
	  prv = input[i - 1] if (i > 0)
	  nxt = input[i + 1] 
	  idx = input.size - i - 1
	  break
	end
  end
  return [idx, prv, nxt]
end
```

Once I register the filter, I can use it in my liquid code like so!

```liquid
{% assign col = site.art | sort: date %}
{% assign info = col | getArtNxtPrv: page.path %}
{% assign index = info[0] %}
{% assign prev = info[1] %}
{% assign next = info[2] %}
```

### Getting tags
Some tags are automatically added in. Such as tags to indicate the year or whether I've written any commentary. Tags can also be grabbed from the path of image. So the example from the start (`26/doodle/Dresses.jpg`) would have the tag `doodle` added. 
```ruby
def getTags(input, date = true, offset = nil)
  return unless (input)
  tags = []

  if (date && input['date'])
	date = input['date'].to_s.split("-")[0]
	tags << date
  end

  split = input['path'].sub('_art/','').split("/")
  split.pop
  if (split.length > 1)
	split.shift(offset.to_i) # offset to ignore the date!!!
	tags.concat(split)
  end
  
  tags.concat(input['tags']) if ( input['tags'] )

  tags << "multi" if ( input['extra'] )
  
  # does the strip thing I mentioned above!
  tags << "with-commentary" if ( input['content'].strip != '' )

  return tags
end
```

## Conclusion
Most of the changes are exclusively from my end but I feel like putting a screenshot of the archive's current state for, well, archiving purposes! The original post was a 7 months ago, so it's neat to see what's changed so far. Finally caved in and started using the [details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) tag.

![Screenshot of the websites art archive](img/26/art-archive-current.jpg)

So yeah, that's pretty much it! Hope you enjoyed the great lengths I take not to make a proper Content Management System. If your wondering why I held on to the original array system, it's because it never really occurred to me I could do something else? This may come to a surprise but I only started using a Static Site Generator August of last year. There still so much I'm trying to figure out what I can and can't do - the former being far beyond I've initially anticipated. The more time I spend recovering low res copies of my art posted in Instagram, the more I appreciate the flexibility of making your own website has. It's really satisfying seeing a decade worth of work archived and organized.

Anywayyyss back on April of this year, I wanted to make a sappy ass blog post celebrating this website's 3 year anniversary but couldn't find the time for it. So I'll just celebrate it now. I love this stupid ass website!!! I love internet history!! I love the indie web!!! I love learning programming!! I love open source software!!!!! I am grateful for anything and everything for existing (❁´◡\`❁)

artists should.. make websites. it's........... kinda fun.

