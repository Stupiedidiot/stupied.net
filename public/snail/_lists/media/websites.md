---
title: Wesbites!! 
---
### Neocities / Nekoweb
{% assign list = site.data.outlinks %}
{% for item in list %}
{%- assign link = item.id | prepend: "https://" | append: '.neocities.org' -%}
- [{{ item.title | default: item.link | default: item.id | replace: 'https://', '' | replace: '/', '' }}]({{ item.link | default: link }})
{% endfor -%}
- [the rat's nest](https://justsnooze.neocities.org/)
- [wolf & ghostling](https://wolf-and-ghostling.neocities.org/)
- [C0D3CR34TUR3!!](https://codecreature.net/home/)
- [jb's site](https://jbc.lol/)
- [outerweb](https://outerweb.org/)
- [✦ 𝗍𝗁𝖾 𝗆𝖾𝗅𝗍 𝗓𝗈𝗇𝖾](https://meltknuckles.net/)
- [heatherfranzen.com](https://www.heatherfranzen.com/)

### Portfolios / Miscellaneous
- [Louie Zong](https://www.louiezong.com/)
- [jackiezhang](https://jackiezhang.co.za/)
- [josephacoleman](https://josephacoleman.com/)
- [romanmuradov](https://romanmuradov.com/)
- [lynnandtonic](https://lynnandtonic.com/)
- [characterdesignreferences](https://characterdesignreferences.com/)
- [plantgrid](https://meewillis.neocities.org/plantgrid/)
- [floor796](https://floor796.com/)
- [breadavota.cafe](https://breadavota.cafe/)
- [neal.fun](https://neal.fun/)
- [Tektonten Papercraft](https://tektonten.blogspot.com/)
- [tysontan](https://tysontan.com/)
- [Behind the Name](https://www.behindthename.com/)
- [Roadside America](https://www.roadsideamerica.com/)
- [cagrimmett.com](https://cagrimmett.com/)
- [lislecoombs.me](https://www.lislecoombs.me/)
- [waldenfont.com](https://www.waldenfont.com/)
- [manacake.co](https://manacake.co/)
- [5amg](https://5amg.web.fc2.com/)
- [pintr](https://javier.xyz/pintr)

### Propaganda
- [Vanilla JS](http://vanilla-js.com/)

### Games!!
- [Tetr.io](https://tetr.io/)
- [Nonograms](https://www.puzzle-nonograms.com/)
- [More Nonograms](https://www.nonograms.org/)

### Character Makers
- [Pokemon Trainer Card Builder](https://pokecharms.com)
- [Southpark Character Maker](https://sp-studio.de/)

### Articles
- [Game Boy Advance Architecture](https://www.copetti.org/writings/consoles/game-boy-advance/)
- [Explaining Trees](https://projectc190.net/projects/explainers/trees.html)
- [Finding inspiration](https://stuffandnonsense.co.uk/transcending-css-revisited/chapter-11.html)
- [Liquid Glass in the Browser](https://kube.io/blog/liquid-glass-css-svg/)
#### SASS Related
- [Sass Techniques from the Trenches](https://css-tricks.com/sass-techniques-from-the-trenches/)
	- [Mixin to Manage Breakpoints](https://css-tricks.com/snippets/sass/mixin-manage-breakpoints/)