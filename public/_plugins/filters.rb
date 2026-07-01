module Jekyll
  module MiscFilters

    def getTitle(input, id = 'img')
      if (input['title'])
        return input['title']
      elsif (input[id])
        return input[id].split('/').pop.split('.')[0].gsub('-', ' ')
      else
        puts "#{@context.registers[:page]['url']} - TITLE UNKNOWN!!!\n#{input}\n=============\n"
        return "TITLE UNKNOWN"
      end
    end

    def sort_tags(tags)
      tags.sort_by { |tag, posts| [-posts.size, tag.downcase] }
    end
  

  end
end

Liquid::Template.register_filter(Jekyll::MiscFilters)