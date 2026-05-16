module Jekyll
  module MiscFilters

    def getTitle(input, id = 'img')
      if (input['title'])
        return input['title']
      elsif (input[id])
        return input[id].split('/').pop.split('.')[0].gsub('-', ' ')
      else
        puts "#{@context.registers[:page]['url']} - TITLE UNKNOWN!!!\n#{input}\n=============\n"
        return "TITLE UNKNOWN"
      end
    end
    
    # def fileExists(input)
    #   if()
    #     return true
    #   else
    #     return false
    #   end
    # end

    def filterFuture(input)
      return [] unless input.is_a?(Array)
      date =  @context.registers[:site].time.to_i

      # UNCOMMENT FOR DEBUGGING!
      #puts "#{@context.registers[:page]['path']} ==================="
      
      input.each.with_index(0) do |e, i|
        #puts "#{i}: #{e['title']||e['img']||""}"
        
        date_current = e['date']
        if date_current.is_a?(String)
          date_current = Time.parse(date_current).to_i 
        end

        if (date_current > date)
          input.delete_at(i)
        else
          break
        end

      end

      return input
    end

  end
end

Liquid::Template.register_filter(Jekyll::MiscFilters)