Jekyll::Hooks.register :site, :post_read do |site|
    docs = site.collections['reviews']
    folder = "/reviews/img/"
    if docs
        docs.each do |doc|
            slug = "#{doc.basename.sub('.md', '').downcase}.jpg"
            
            raw = File.join(site.source, "/snail/_img", folder, slug)
            if File.exist?(raw)
                doc.data['thumbnail'] = File.join(folder, slug)
                
                dime = FastImage.size(raw)
                if dime
                    doc.data['dime'] = dime
                else
                    doc.data['dime'] = [0,0]
                end
            else
                doc.data['thumbnail'] = File.join(folder, "placeholder.png")
                doc.data['dime'] = [4,3]
            end

            if doc.relative_path.include?("/f/")
                doc.data['done'] = true
            end
        end
    end
end