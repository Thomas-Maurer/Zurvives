class CreateCharacterEquipements < ActiveRecord::Migration
  def change
    create_table :character_equipements do |t|
      t.belongs_to :character, index: true
      t.belongs_to :equipement, index: true
    end
  end
end
