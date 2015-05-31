class Equipment < ActiveRecord::Base
  #Allow MTI
  actable

  has_one :special_ability
end
