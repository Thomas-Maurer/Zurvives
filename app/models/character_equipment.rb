class CharacterEquipment < ActiveRecord::Base
  belongs_to :character
  belongs_to :equipment
end
