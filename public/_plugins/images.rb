require 'fastimage'

module Jekyll
    module ImageHook
        Jekyll::Hooks.register :documents, :pre_render do |doc|
            config = doc.site.config['img_gallery'] || []
            col = doc.collection.label
            next unless config.include?(col)

            source = doc.site.source
            folder = File.join('snail/_img', col , 'img')
            folder_col = "_#{col}/"

            slug = "#{doc.path.split(folder_col)[1].sub('.md', '')}.#{doc.data['ext']}"
            doc.data['thumbnail'] = "/#{col}/img/#{slug}"
            doc.data['img'] = slug

            raw = File.join(source, folder, slug)
            if File.exist?(raw)
                dime = FastImage.size(raw)
                if dime
                    doc.data['dime'] = dime
                else
                    doc.data['dime'] = [0,0]
                end
            else
                doc.data['dime'] = [0,0]
            end

            doc.content = doc.content.gsub(/(?<=\]\(_)[^\/]+(?=\/)/) { |match| "#{match}/p" }
            if (doc.content.strip != '')
                doc.data['w_comment'] = true
            end

            tags = []
            year = doc.data['date']
            tags << year.to_s.split("-")[0] if (year)

            split = slug.split("/")
            split.pop
            if (split.length > 1)
                split.shift(1)
                tags.concat(split)
            end
            
            tags.concat(doc.data['tags']) if ( doc.data['tags'] )

            tags << "multi" if ( doc.data['extra'] )
            tags << "with-commentary" if ( doc.data['w_comment'] )

            doc.data['tags'] = tags
        end
    end

    module ImageFilters
        def getNxtPrv(input, target)
            idx = nxt = prv = nil
            input.each_with_index do |e, i|
                if ( e.relative_path == target )
                prv = input[i - 1] if (i > 0)
                nxt = input[i + 1] 
                idx = input.size - i - 1
                break
                end
            end
            return [idx, prv, nxt]
        end

        # Returns array of dimension
        def getDime(input, dir = nil)
            source = @context.registers[:site].source
            path = ''

            if (dir)
                path = File.join(source, File.join(dir,input))  
            elsif (input.start_with? '/')
                path = File.join(source, input)
            else
                dir = (@context.registers[:page]['dir'] || '')
                path = File.join(source, dir,input)
            end
            
            if File.exist?(path)
                dimensions = FastImage.size(path)
                if dimensions
                    return dimensions
                else
                    puts "Can't get image dimensions of #{path}\n\n"
                end
            else
                puts "Error found in: #{@context.registers[:page]['url']}\n"
                puts "File #{path} does not exist\n\n"
                return [0,0]
            end
        end

        # returns string of dimensions
        def writeDime(input, dir = nil)
            width, height = getDime(input, dir)
            return "#{width}x#{height}"
        end

        # get all images and add "--width" and "--height"\
        def justifyImages(input, dir = nil)
            input.gsub!(%r{<img\s+([^>]*?)src="([^"#]+)"(?![^>]*(?:width|height))([^>]*?)>}i) do |match|
                # Capture the tag attributes and the image source
                before = Regexp.last_match(1).to_s.strip
                source = Regexp.last_match(2).to_s.strip
                after  = Regexp.last_match(3).to_s.strip
                
                # Determine the full path of the image
                if (source == '#' || before.include?('style=') || after.include?("style="))
                    return match
                end
                
                width, height = getDime(source, dir)
                "<img #{before} src=\"#{source}\" style=\"--width: #{width}; --height: #{height}\" #{after} loading=\"lazy\">"
            end
            input
        end

        def getImgs(input)
            site = @context.registers[:site]
            source = site.source
            url = site.config['url']
            dir = (input['dir'] || '').sub(%r{^/$}, '')
            content = input['content'] || input.to_s
            result = []

            content.scan(%r{<img[^>]*\s+src="([^"]+)"}i) do |match|
            src = Regexp.last_match(1).to_s.strip
            
            if src.start_with?('/')
                path = File.join(source, src)
                else
                path = File.expand_path(src, File.join(source, dir))
                end

                if (File.exist?(path))
                path = path.sub(source, url)
                result << path unless result.include?(path)
                end
            end
            result
        end
    end
end

Liquid::Template.register_filter(Jekyll::ImageFilters)