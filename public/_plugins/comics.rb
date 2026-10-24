module StupiedComics
    Jekyll::Hooks.register :site, :post_read do |site|
        docs = site.collections['comics'].docs
        art = site.collections['art'].docs
        folder = "/lib/img/"
        json = 'main.json'
        
        if docs
            docs.each do |doc|
                doc.data['thumbnail'] = folder + doc['slug'] + ".png"
                docs_rel = art.select { |e| e.data['category'] == doc['slug'] && e.data['date'] < site.time }

                if(docs_rel[-1])
                    doc.data['date'] = docs_rel[-1].data['date']
                end
                doc.data['docs'] = docs_rel

                path = doc.url.split('/')[0...-1].join('/')
                page = Jekyll::PageWithoutAFile.new(site, site.source, path, json)    
                page.data['layout'] = 'library-ext'
                page.data['docs'] = docs_rel
                site.pages << page

                doc.data['json'] = page.url
            end
        end

        docs.sort_by! { |doc| doc.date }
    end
end