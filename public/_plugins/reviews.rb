Jekyll::Hooks.register :site, :post_read do |site|
    docs = site.collections['reviews']
    folder = "/reviews/img/"
    placeholder = "placeholder.png"
    if docs
        docs.each do |doc|
            slug = "#{doc.basename.sub('.md', '').downcase}.jpg"
            
            raw = File.join(site.source, "/snail/_img", folder, slug)
            if File.exist?(raw)
                doc.data['img'] = slug
                doc.data['thumbnail'] = File.join(folder, slug)
                
                dime = FastImage.size(raw)
                if dime
                    doc.data['dime'] = dime
                else
                    doc.data['dime'] = [0,0]
                end
            else
                doc.data['thumbnail'] = File.join(folder, placeholder)
                doc.data['dime'] = [4,3]
            end

            if(doc.data['rank'])
                doc.data['tags'] << doc.data['rank'].downcase + "-tier"
            end

            if doc.relative_path.include?("/f/")
                doc.data['done'] = true
            end
        end
    end
end