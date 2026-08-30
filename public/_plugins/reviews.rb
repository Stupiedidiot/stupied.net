Jekyll::Hooks.register :site, :post_read do |site|
    docs = site.collections['reviews']
    return unless docs

    docs.each do |doc|
        slug = "#{doc.basename.sub('.md', '')}.jpg"
        
        raw = File.join(site.source, "/snail/_img/chez/reviews/img/", slug)
        if File.exist?(raw)
            doc.data['thumbnail'] = "/chez/reviews/img/#{slug}"
            
            dime = FastImage.size(raw)
            if dime
                doc.data['dime'] = dime
            else
                doc.data['dime'] = [0,0]
            end
        end

        if doc.relative_path.include?("/f/")
            doc.data['done'] = true
        end
    end
end