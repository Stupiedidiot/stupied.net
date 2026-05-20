module Jekyll
  module FileExistsFilter
    def check_file(input, default = nil)
      if (File.exist?(File.join(@context.registers[:site].source, input)) )
        return input
      elsif (default)
        return default
      else
        return nil
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::FileExistsFilter)