module Jekyll

  class JekyllLibraryGenerator < Generator
    safe true

    # Please figure out to make this global!
    def getTitle(input)
      if (input['title'])
        return input['title']
      else
        return input['issue'].split('/').pop.split('.')[0].gsub('-', ' ')
      end
    end

    def generate(site)
      data = site.config['lib_gen']
      return unless (data)

      # yay =  site.data['art']['list'].select { |e| e['img'].include?('/comic/') }


      data.each do |e|
        records = nil
        path = site.source
        e['data'].split('.').each do |level|
          if records.nil?
            records = site.data[level]
          else
            records = records[level]
          end
          path = File.join(path, level) 
        end
        if (records.kind_of?(Hash))
            records = records.values
        end

        path = path.gsub('/site/data/', '/_data/') + '.yml'

        template = e['template']

        records.each do |volume|
          files = volume["files"]
          if(files)
            size = files.size
            files.each_with_index do |issue, index|
              dir = e['dir'] + '/' + volume['volume']              
              issue['volume'] = volume['volume'] 
              issue['volume_title'] = volume['title']

              issue['prev'] = files[index - 1].dup if (index > 0)
              
              if (index < size - 1)
                issue['next'] = files[index + 1].dup
                issue['next']['issue'] = issue['next']['issue'].downcase
              end

              issue['title'] =  getTitle(issue) unless (issue['title'])
              issue['issue'] = issue['issue'].downcase
              
              site.pages << DataPage.new(site, site.source, nil, dir , nil, nil, issue, "issue", nil, "title", nil, template, 'html', nil)
            end
          end
        end

      end

    end
  end

  module LibraryFilters
    def mergeIssues(input)
      result = []
      input.each do |volume|
        next unless (volume['files'])
        volume['files'].each do |issue|
          e = issue
          e['dir'] = volume['volume']
          e['path'] = e['dir'] + '/' + e['issue']
          result << e
        end
      end
      return result
    end
  end

end
Liquid::Template.register_filter(Jekyll::LibraryFilters)