Jekyll::Hooks.register :site, :post_read do |site|
    docs = site.collections['posts']
    if docs
        docs.each do |doc|
            unless doc.data['thumbnail']
                thumb = doc.content.match(/!\[(.*?)\]\((.*?)\)/)

                if thumb
                    doc.data['alt'] = thumb.captures[0]
                    doc.data['thumbnail'] = thumb.captures[1]
                end
            end
        end
    end
end