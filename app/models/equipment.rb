class Equipment < ActiveRecord::Base
  #Allow MTI
  actable

  belongs_to :special_ability
end
