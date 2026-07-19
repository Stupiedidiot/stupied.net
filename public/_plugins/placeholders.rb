module Jekyll
  module Drops
    class UrlDrop < Drop      
      
      def name_raw
        @obj.basename.split('.md')[0]
      end

      def category
        @obj.data['category'] || ""
      end

    end
  end
end