{% for movie in site.data.lists.watchlist %}
- [{{ movie[0] }}] {{movie[1]}}
{% endfor %}