
# pls make the date always be the most recently uploaded, ty
Jekyll::Hooks.register :site, :post_read do |site|
    docs = site.collections['comics']
    folder = "/lib/img/"

    if docs
        docs.each do |doc|
            doc.data['thumbnail'] = folder + doc['slug'] + ".png"
        end
    end
end