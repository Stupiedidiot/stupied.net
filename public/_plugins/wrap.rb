module StupiedMedia
    require 'date'

    date_start = Date.parse("2024-01-01")
    date_end = Date.today >> -1

    Jekyll::Hooks.register :site, :post_read do |site|
        next unless site.config['deploying']

        text = site.data['wrap-text']
        categories = [
            site.collections['art'],
            site.collections['posts'],
            site.collections['media']
        ]

        months = []
        curr = date_start
        folder = "wrap"

        while curr < date_end
            data = {}
            categories.each do | cat |
                next unless cat

                cat_data = cat.docs.select do |e|
                    yay = e.data['date']
                    (yay.year == curr.year && yay.month == curr.month)
                end

                unless cat_data.size == 0
                    data[cat.label] = cat_data
                end
            end

            if data.any?
                title = curr.strftime("%B %Y")
                filename = curr.strftime("%Y-%m")
                url = "/#{ folder }/#{ filename }"

                data = {
                    "date" => curr,
                    "title" => title,
                    "url" => url,
                    "data" => data,
                    "index" => months.size,
                }
                if text[filename]
                    data['content'] = text[filename]
                end
                months << data

                page = Jekyll::PageWithoutAFile.new(site, site.source, folder, filename + ".html")
                page.data['layout'] = 'wrap-view'
                page.data.merge!(data)                
                site.pages << page
            end

            curr = curr >> 1
        end

        site.data["wrap"] = months
    end
end