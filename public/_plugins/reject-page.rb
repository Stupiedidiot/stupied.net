module Jekyll
    module RejectPage
        Jekyll::Hooks.register :site, :pre_render do |site|
            site.pages.reject! do |page|
                page.data['delete'] == true
            end
        end
    end
end