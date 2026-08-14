---
index: 1
date: 2026-08-13T12:35
title:
description:
category: meta
tags:
---
Everything in the website is statically generated with [Jekyll](https://jekyllrb.com/). I will not being going over the basic set up. That's what the docs are for. Just going over some weird stuff done and the rational behind them.
## Config Files
Okay all you really need to build a jekyll website is this.
```
bundle jekyll build
```
This will look for `_config.yaml` inside the folder you run the command in. Then it will through your source folder, usually the root folder, and put the result in the output folder, which is typically called `_site`.

If you clone the [repository](https://github.com/Stupiedidiot/stupied.net) for this website you might notice that there's a the default `_config.yml` file located inside the root and a `deploy.yml` tucked away somewhere. The reason is because Windows is so much slower at running ruby than Linux. So build times would take fooooorreevver. To mitigate this, I would tuck away certain config settings and only use them for when it's time to deploy. Things, like fetching external data files or collections I don't check on often, would be added into the other config file. So the command to build the *entire* website would look like this:
```
bundle jekyll build --config _config.yml,cowtools/config/deploy.yml
```

Whenever I'm editing the website, I have these partiular commands to run.
```
bundle exec jekyll clean
bundle exec jekyll build --config _config.yml,.vscode/local.yml --watch --incremental --limit_posts 3
```

Here's a break down of what everything does:
- `bundle exec` - Only use the gems specified in gemlock file
- `jekyll clean` - Removes the previous build. Starts fresh; Avoids caching headaches.
- `--config` - Specify what config files to use to. The local.yml is a config file I use to excluded certain collection items for years ago from rendering.
- `--watch` - Will watch over your source folder and rebuild for any changes.
- `--incremental` - For each rebuild, it will only regenerate pages that have changed. This does not include collections though. Those fucks will regenerate regardless if the change is related to it. Also, if you change a data file, any pages using it will not be effected. You'll have to edit those again for the changes to take in effect.
- `--limit_posts` - Remember that thing about collections above? Well, Jekyll blog posts are stored in a `_post` collection. I don't blog that frequently and posts from years ago rendered isn't that necessary so it's limit to just 3.

Anyways, that command is way too long! So instead of manually typing all those command, I've set up a  VSCode task. This way, the commands above can be easily ran by clicking `ctrl + shift + B` and pick between the tasks. Inside a `.vscode` folder in the root, there is a `task.json` file which looks a bit like this.
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Jekyll",
      "type": "shell", // runs task in terminal
      "command": "bundle exec jekyll clean; bundle exec jekyll build --config _config.yml,.vscode/local.yml --watch --incremental --limit_posts 3",
      "options": {
	      // set environmental variables if needed
		  "env": { "JEKYLL_ENV": "production" }
	  },
	  // the task ran when doing ctrl + shift + B shortcut
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },

    // insert other commands
  ]
}
```

### Pagefind
If you open up my `_config.yml` file, you'll find this.
```yaml
keep_files:
- "pagefind"
```

I use [Pagefind]() for implementing a static search system. It basically loops through output folder and index words into gzips that can be naviagted through javascript. When I'm editing, most of the edits made are minor and running Pagefind for each build is excessive. This just tells Jekyll not to delete any files inside the pagefind folder.

## Conclusion
Don't be like me. Go use a better static site generator!!!! Even better yet, learn php andsql.