Jekyll::Hooks.register :site, :post_read do |site|
    docs = site.collections['comics'].docs
    art = site.collections['art'].docs.reverse_each
    folder = "/lib/img/"
    
    puts site.time
    if docs
        docs.each do |doc|
            doc.data['thumbnail'] = folder + doc['slug'] + ".png"
            
            latest = art.find { |e| e.data['category'] == doc['slug'] && e.data['date'] < site.time }

            if(latest)
                doc.data['date'] = latest.data['date']
            end
        end
    end

    docs.sort_by! { |doc| doc.date }
end