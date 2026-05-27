require 'fileutils'

folders = [
    [
        "public/snail/_img/chez/reviews/img/",
        "x200"
    ],
    [
        "public/snail/_img/blog/micro/img/",
        "700x"
    ]
]

folders.each do |folder_config|
    target = folder_config[0]
    dimension = folder_config[1]
    next unless Dir.exist?(target)

    images = Dir.glob(File.join(target, "**", "*.{jpg,jpeg,png,gif}"))

    p "[#{dimension}] ====================="

    images.each do |img|
        folder = File.join(File.dirname(img), '_ignore')
        FileUtils.mkdir_p(folder)
        FileUtils.cp(img, folder)

        if (img.downcase.end_with?('.gif'))
            p "SKIPPED: #{img}" 
            next
        end

        `magick "#{img}" -resize #{dimension} -quality 90 "#{img}"`
        p "RESIZED: #{img}"
    end
end