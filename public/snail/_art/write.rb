
$images.each do |img| 
    out = img.split('/').drop(2)
    out = out.join('/')
    out = out.split('.').first

    out_full = File.join("bulk", out)
    FileUtils.mkdir_p(File.dirname(out_full))

    File.open(out_full + ".md", "w") do |file|
        file.puts "---"

        file.write "ext: "
        if (img.downcase.end_with?('.gif'))
            file.puts "gif"
        else
            file.puts "jpg"
        end

        file.puts "date: 20#{out.split('/').first}-01-01"
        file.puts "---"
    end
end

puts "Created all Markdown Files!"