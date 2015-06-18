class CreateCharacterEquipements < ActiveRecord::Migration
  def change
    create_table :character_equipments do |t|
      t.belongs_to :character, index: true
      t.belongs_to :equipment, index: true
    end
  end
end
