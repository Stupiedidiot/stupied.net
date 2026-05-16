---
layout: page-md
title: Frequently Asked Questions
---
# {{ page.title }}
There's tons of people asking questions and only one of mes to answer them. I'd rather not explain the same things multiple times over, so yeah!

---

## Advice for New Webmasters
Great, so you now want to make a website? Where the hell do you begin?

### [1] Start Contemplating
What's your website for? Is it to store long text or boisterously show off art? Should the design be practical or should you ignore every webdev convention out there? Sketch out your ideas and figure what you need to get it done.

### [2] Know What to Google
Try to learn the terminologies. Like the hell are nesting elements or sematic tags? Figure out the names of those whatchamacallits and doohickey widgets you like. Being able to word out what you're looking for comes a long way

### [3] Code your Pages Locally
There are too many wonderful text editors out there to let yourself suffer through neocities dinky ass editor. I personally use [VSCode](https://code.visualstudio.com/) with the [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) - but there are alternatives out there that don't require you to sell your soul to Microsoft.

### [4] Setup Neocities CLI / Github Action
This [blog post](https://nenrikido.neocities.org/blog/post/deploy-site/) by Nenrikido should help you set either one up. Then there's also this [tutorial](https://petrapixel.neocities.org/coding/git-tutorial) by Petrapixel that goes more in-depth of how to use Github. It's a bit of a pain at first but, once you get it going, you'll never miss the dashboard!

### [5] Consider Using a Static Site Generator
They're so awesome and stuff. Like seriously you guys.

### [6] If You Ignored Advice #3
`ctrl + shift + r` for when your code isn't updating.

---

## How'd You Do _?
Usually with a lot of pain and suffering.

{% assign RELATED = site.posts | where_exp: "item", "item.tags contains 'spaghetti'" %}
<div id="blog-archive">
{% include widget/timeline.html data=RELATED no_desc=true %}
</div>

---
<img src="/art/img/23/Vicious-Cycle.jpg" alt="" class="float-left" style="max-width: 280px;">
{% include lists/item.html where='tools' %}
<hr class="clear">

---

## Can I Take Inspirations From Your _?
To put it bluntly, I do not care what others do with my work. We've all at one point been inspired by something and, whether intentionally or not, model ourselves accordingly to it. Originality is relative. So please, feel free to nab ideas from my website. Credit absolutely not required! Everything is just pointless static in the grand scheme of things.

---

## Where the Hell is Your Button?
Below is the most recent one. You can find the rest over [here](/outlinks/#button)

<img src="/meta/button.png" alt="stupied" style="width: auto">

---
## I Still Have More Questions!
Feel free to ask them in my [Guestbook](/guestbook). I'll try to get to them on days I'm not feeling lazy.

Anyone asking things that are already answered here will be ignored. Thank you for understanding and have a lovely rest of your day! <span class="dont-break">(´▽`ʃ♡ƪ)</span>