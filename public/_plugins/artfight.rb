module Jekyll
  module Artfight

    def afTotal(input)
      total = {
        "team" => "Overall",
        "pts" => 0,
        "atk" => 0,
        "ffr" => 0,
        "def" => 0
      }

      input.each do |e|
        total['pts'] += e['pts']
        total['atk'] += e['atk']
        total['ffr'] += e['ffr']
        total['def'] += e['def']
      end

      return total 
    end

    def afRatio(input)
      atk = input['atk'] + input['ffr']
      ttl =  atk + input['def']
      res = (atk.to_f / ttl.to_f) * 100 
      return res
    end

  end
end

Liquid::Template.register_filter(Jekyll::Artfight)