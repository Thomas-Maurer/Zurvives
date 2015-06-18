class Equipment < ActiveRecord::Base
  #Allow MTI
  actable
  self.table_name = "equipments"
  belongs_to :special_ability
end
