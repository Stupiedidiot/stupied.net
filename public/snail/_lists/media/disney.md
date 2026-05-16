---
title: Disney Stuff
---

{% assign LINKS = site.reviews | where_exp: "e", "e.path contains 'disney/'" | where: "link", true | sort: 'release' %}
    {% for item in LINKS %}
        {%- capture title -%}
            {{ item.title | default: item.filename }}{% if item.release %} ({{ item.release }}){% endif %}
        {%- endcapture -%}
        
    - [{{ title }}]({{ item.link }})
{% endfor %}

### Youtube Playlists
- [House of Mouse](https://www.youtube.com/playlist?list=PL9ak1M9WpLPASw5ihysS7FSXaBQfxaECM)
- [Ducktales (2017)](https://youtube.com/playlist?list=PLraj1zZKqaDS8VugtFJnHFOmvbPp_n8lS)
- [Duck Present's](https://youtube.com/playlist?list=PLq7-TDAyoltZ1ShvnDG_nkXs51F8ri3xV)
- [Donald Duck Shorts](https://www.youtube.com/playlist?list=PLQBpys4fyPfX6XvSk_Xt9WiGifeXkmtXe)
- [Goofy Shorts](https://youtube.com/playlist?list=PLWcODnEVd5uuBCxBpKWBn1mo5FI_tOuKT)
- [Goof Troop](https://youtube.com/playlist?list=PLv042z7GzQ6uVDI5O6mjYNup985n97Dm0)
- [The MousePack - Mickey and Friends Singing Classic Standards](https://youtube.com/playlist?list=PLK9sc8FKyYZw-xZf_OOurq-G1r-QUCIun)

### Disney World Shows
- [Kitchen Kabaret](https://youtu.be/TKUHjWTvgA0)

### Audio Books
- [Adaptation of Dickens' Christmas Carol](https://youtu.be/MjMDQUYrtso)