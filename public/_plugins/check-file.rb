module Jekyll
  module FileExistsFilter
    def check_file(input)
      if (File.exist?(File.join(@context.registers[:site].source, input)) )
        return input
      else
        return nil
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::FileExistsFilter)