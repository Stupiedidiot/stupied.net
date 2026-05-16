

# Removing Image Metadata
Images have [metadata](https://en.wikipedia.org/wiki/Exif) that can contain sensitive data which Github does not automatically remove. As an artist, my website is chuck full of images that I keep forgetting to sanitize. Luckily we can utilize a [hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to automatically do it instead

Inside the `.git/hooks/` folder create a file called `pre-commit`. This script will run everytime `git commit` is used. Using the language and image processor of your choice, you go through the staged changes and strip the metadata of the images. This is the script I use.

```ruby
#!/usr/bin/env ruby

staged_images = `git diff --cached --name-only --diff-filter=ACM`
  .split("\n")
  .select do |file|
    file.match?(/\.(jpe?g|png|gif|tiff|webp)$/i) &&
      File.exist?(file)
  end

exit 0 if staged_images.empty?

puts "Stripping Metadata *ੈ✩‧₊˚༺☆༻*ੈ✩‧₊˚"

staged_images.each do |file|
  success = system("magick", file, "-auto-orient", "-strip", file)

  if success
    system("git", "add", file)
    puts "  Cleaned: #{file}"
  else
    warn "  Failed: #{file}"
  end
end

exit 0
```

For this to work you to have [Ruby](https://www.ruby-lang.org/en/) and [ImageMagick](https://imagemagick.org/) installed.

# Art Archive


`snail/_art` folder contains markdown files. Each file represent 

- `date` - when art is posted
- `title` - specific title, overrides default
- `desc` - caption for the art
- `extra` - additional images 
- `tags` - keywords to categorize art




## `main.json` 
Th

## Related Blog Posts
- [Making an Art Archive](https://stupied.net/blog/2025-10-11-Art-Archive)
- [Using Obsidian for Art Archive](https://stupied.net/blog/2026-05-08-Obsidian-for-Art)