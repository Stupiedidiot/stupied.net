#  🎏stupied.net
Welcome to my website's source code! A place for all my art and ramblings; It will forever be a work in progress. This gets updated recreationally so horrible code is tolerated constantly.

![stupied's button](https://stupied.net/meta/button.png)

## how in the helly?
Explaining is not my strong suit and neither is remembering to document changes. All you need to understand is this is bult with [Jekyll](https://jekyllrb.com/). The [collections](https://jekyllrb.com/docs/collections/) are stored in the `snail` folder and are edited with [Obsidian](https://obsidian.md/). They are usually manipulated in some way with [hooks](https://jekyllrb.com/docs/plugins/hooks/); You can check those out in the `_plugins` folder.

### how to build
Make sure you have [Ruby](https://www.ruby-lang.org/en/) and all the other dependencies listed in the `gemfile`. Then add this flag to your build command:
```
--config _config.yml,cowtools/config/deploy.yml
```

## can i use this as template
Theorethically you could. Practically you shouldn't.