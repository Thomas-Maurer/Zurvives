class Equipment < ActiveRecord::Base
  #Allow MTI
  actable
#Force actable name
  self.table_name = "equipments"

  belongs_to :special_ability
end
