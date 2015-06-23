class CharacterWeapon < ActiveRecord::Base
  after_create :add_to_equipment
  belongs_to :character
  belongs_to :weapon

  def add_to_equipment
    CharacterEquipment.create(character_id: self.character.id, equipment_id: self.weapon.id)
  end
end
