---
index: 2
date: 2026-07-21T19:49
title: Art Gallery
description: Going over how my gallery works.
category: meta
tags:
render_with_liquid: false
---
## ATTENTION!!
> This isn't finished,,,, Will do so in a future date! I pinky promise!!!!!!!!

At time of writing this, my [art gallery](/art/) stores around ~1000 images. You can imagine how difficult it is to sift through. Most artist tend to organize their art by years inside of separate html files. But due to the variety of the art I make, I feel like it would be tedious for anyone looking for art of a specific topic. So this entire system of organization and filtering was made!

## Set Up
Each art piece is stored in a [markdown](https://en.wikipedia.org/wiki/Markdown) file. This is so adding commentary to pieces are easy and can be easily edited with a text editor. Each markdown file have the following properties:
- `thumbnail` - this is the relative path of the file. Each markdown file has it's corresponding image file with the same path as it. So the markdown file `25/comic/Hourly-01.md` would have the image file `25/comic/Hourly-01.jpg` located in it's own folder. 
- `ext` - the file extension (`jpg`, `gif`, etc.).
- `date` - date file was made.
- `title` - it does what it is called. 
- `alt` - the alt text for file.
- `extra` - additional files to attached to post. 
- `tags` - used for sorting topics.

Not all of these properties are manually added in; As you will see in a while.

### Obsidian
> yap about how I use Quick Add Plugins

The template looks a bit like this:
```yaml
---
ext: jpg
date: {{date:YYYY-MM-DDTHH:mm}}
title:
alt:
extra:
tags:
- traditional
- digital
- ocs
---
```

The date is automatically added in with a template.

Those tags are add in by default because they are the most likely to be added in.

### Base
Obsidian [Bases](https://obsidian.md/help/bases) are used organize my data without needing to build the website. They are so awesome you guys.

### Jekyll
```yaml
collections:
  art:
    output: true
    permalink: /art/p/:path
    sort_by: date
```

```yaml
defaults:
- scope:
      type: art
    values:
      layout: art-view
```

#### Hooks
This can be achieved with Jekyll [Hooks](https://jekyllrb.com/docs/plugins/hooks/), specifically the `post_read` for `:site`. From there we can loop through the collection files to add in automatically input additional information. The `label` is a string of the current collection, while the `col` is the hash for that collection. The `metadata` is the stuff you set in the `_config.yml` file 

```ruby
Jekyll::Hooks.register :site, :post_read do |site|
    site.collections.each do |label, col|
        next unless col.metadata['gallery']
		# Skip colle
    end
end
```

```ruby
Jekyll::Hooks.register :site, :post_read do |site|
    site.collections.each do |label, col|
        next unless col.metadata['gallery']
        folder = File.join('snail/_img', label , 'img')
        folder_col = "_#{label}/"
        
        col.docs.each do |doc|
            slug = "#{doc.path.split(folder_col)[1].sub('.md', '')}.#{doc.data['ext']}"
            doc.data['thumbnail'] = "/#{label}/img/#{slug}"
            doc.data['img'] = slug

            raw = File.join(site.source, folder, slug)
            if File.exist?(raw)
                dime = FastImage.size(raw)
                if dime
                    doc.data['dime'] = dime
                else
                    doc.data['dime'] = [0,0]
                end
            else
                doc.data['dime'] = [0,0]
            end

            if (doc.content.strip != '')
                doc.data['w_comment'] = true
            end

            tags = []
            year = doc.data['date']
            tags << year.to_s.split("-")[0] if (year)

            split = slug.split("/")
            split.pop
            if (split.length > 1)
                split.shift(1)
                tags.concat(split)
            end
            
            tags.concat(doc.data['tags']) if ( doc.data['tags'] )

            tags << "multi" if ( doc.data['extra'] )
            tags << "with-commentary" if ( doc.data['w_comment'] )

            doc.data['tags'] = tags
        end
    end
end
```
##### Dimensions
I use [FastImage](https://rubygems.org/gems/fastimage) to get the dimension of images.s
##### Additional Tags
I am lazy and don't like repeating myself.

The subfolders of a file
##### With Commentary?
Typically when 
```liquid
{% if item.property %}
	<!-- Do a thing! -->
{% endif %}
```

But for Jekyll the pages `content` is always set true, even if said content is just a [whitespace](https://en.wikipedia.org/wiki/Whitespace_character). We first need to strip the 

```ruby
if (doc.content.strip != '')
	doc.data['w_comment'] = true
end
```

##### Everything Together
The entire hook looks like this!
```ruby
require 'fastimage'
module ImageHook
	Jekyll::Hooks.register :documents, :pre_render do |doc|
		config = doc.site.config['img_gallery'] || []
		col = doc.collection.label
		next unless config.include?(col)
		
		source = doc.site.source
		folder = File.join('snail/_img', col , 'img')
		folder_col = "_#{col}/"

		slug = "#{doc.path.split(folder_col)[1].sub('.md', '')}.#{doc.data['ext']}"
		doc.data['thumbnail'] = slug

		raw = File.join(source, folder, slug)
		if File.exist?(raw)
			dime = FastImage.size(raw)
			if dime
				doc.data['dime'] = dime
			else
				doc.data['dime'] = [0,0]
				puts "Cannot get dimensions of #{raw}"
			end
		end

		doc.content = doc.content.gsub(/(?<=\]\(_)[^\/]+(?=\/)/) { |match| "#{match}/p" }
		if (doc.content.strip != '')
			doc.data['w_comment'] = true
		end

		tags = []
		year = doc.data['date']
		tags << year.to_s.split("-")[0] if (year)

		split = slug.split("/")
		split.pop
		if (split.length > 1)
			split.shift(1)
			tags.concat(split)
		end
		
		tags.concat(doc.data['tags']) if ( doc.data['tags'] )

		tags << "multi" if ( doc.data['extra'] )
		tags << "with-commentary" if ( doc.data['w_comment'] )

		doc.data['tags'] = tags
	end
end
```

## Javascript
Apology for poor english

When were you when vanilla js dies?

i was sat at home working on a neocity when phone ring

'vanilla js is kill'

'no'

*(i pinky promise to elaborate on all of this futher)*

### Lightbox
1. Create an array of all children with parents that has the class `justified-gallery`.
2. Using the fetched json of all files, find the index of current image.
3. If found, add the details into a data attribute (`data-*=""`)
4. Wrap original child with a button. Make sure they inherit the `--width` and `--height` variables so the layout doesn't break
5. Wooowww a looping light of the box!!!

### Filtering
Okay in a nutshell it does the following:
1. Fetch the json file that lists all the files.
2. Creates the html elements of all files.
3. Check if the `t` parameter exists.
4. Filter newly made html elements if it does. Filtering is done using sets to compare the target tags and tags of files.
5. Show a portion of results.

This method has a handful of cons like:
1. Has to parse through *all* files at the beginning.
2. It's filtering is destructive.
3. If I add another tag to an existing list, instead of filtering what it already has, it will loop through everything again.

Unfortunately, I cannot bring myself to care enough to address this issues.
### Related Posts
1. Get the index of art post
2. Starting from index, check if .
3. Repeat until 3 posts have been found or looped back to start of index.
4. When filtering, make sure to remove is done by remove "general" tags first.

## Conclusion
Honestly. Lowkey thinking about learning sql to update this system. Idk only the future can tell. Dear artists, don't become a programmer. Thank you. /j