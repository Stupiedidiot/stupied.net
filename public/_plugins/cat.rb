module Jekyll
  class CatFile < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @file = text.strip;
    end

    def render(context)
      file = context[@file] || @file
      source = context.registers[:site].source
      path = File.join(source, file)

      unless File.exist?(path)
        raise "[cat] File #{path} not found"
      end

      # Get file and remove frontmatter!
      raw = File.read(path).sub(/\A---\s*\n.*?\n---\s*\n/m, '')

      partial = Liquid::Template.parse(raw)
      partial.render(context)
    end
    
  end
end

Liquid::Template.register_tag('cat', Jekyll::CatFile)