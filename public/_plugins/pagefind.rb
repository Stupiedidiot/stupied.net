module Jekyll
  module Pagefind
    @executed = false
    Jekyll::Hooks.register :site, :post_write do |site|
      if !@executed
        command = File.expand_path("bin/", __dir__)

        if RUBY_PLATFORM.include?('linux')
          command = File.join(command, "pagefind")
          command = "chmod +x #{command}; #{command}"
        elsif RUBY_PLATFORM.include?('mingw') || RUBY_PLATFORM.include?('mswin')
          command = File.join(command, "pagefind.exe")
        end

        exclude = Array(site.config.dig('pagefind', 'exclude')).join(",")
        command += " --site #{site.dest} --exclude-selectors \"#{exclude}\""

        puts "Running: #{command}"
        system(command)
        @executed = true
      end
    end
  end
end