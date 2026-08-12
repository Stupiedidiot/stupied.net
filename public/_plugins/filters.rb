module Jekyll
    module MiscFilters

        def sort_tags(tags)
            tags.sort_by { |tag, posts| [-posts.size, tag.downcase] }
        end

        def get_ocs(input)
            data = @context.registers[:site].data['ocs']
            return unless data
            
            input.map { |tag| data[tag] }.compact
        end

    end
end

Liquid::Template.register_filter(Jekyll::MiscFilters)