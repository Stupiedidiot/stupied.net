require 'fileutils'

folders = [
    [
        "public/snail/_img/chez/reviews/img/",
        "x200"
    ]
]

folders.each do |folder_config|
    target = folder_config[0]
    dimension = folder_config[1]
    next unless Dir.exist?(target)

    images = Dir.glob(File.join(target, "**", "*.{jpg,jpeg,png,gif}"))

    puts "[#{dimension}] ====================="

    images.each do |img|
        next if (img.include?('_ignore'))
        
        folder = File.join(File.dirname(img), '_ignore')
        next if (File.exist?(File.join(folder, img.split('/').pop)))
        
        FileUtils.mkdir_p(folder)
        FileUtils.cp(img, folder)

        if (img.downcase.end_with?('.gif'))
            puts "SKIPPED: #{img}" 
            next
        end

        `magick "#{img}" -resize #{dimension} -quality 90 "#{img}"`
        puts "RESIZED: #{img}"
    end
end