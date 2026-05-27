require 'fileutils'

size = "800x"

in_dir = "input"
out_dir = "output"

$images = Dir.glob(File.join("_ignore", in_dir, "**", "*.{jpg,jpeg,png,gif}"))

$images.each do |img| 
    out = img.split('/')
    out[1] = out_dir
    out = out.join('/')
    FileUtils.mkdir_p(File.dirname(out))

    if (img.downcase.end_with?('.gif'))
        FileUtils.cp(img, out)
        p "MOVED: #{img.split('/').drop(1).join('/')}" 
    else
        `magick "#{img}" -resize #{size} -quality 90 "#{out.split('.').first}.jpg"`
        p "RESIZED: #{img.split('/').drop(2).join('/')}"
    end
end

load "write.rb"