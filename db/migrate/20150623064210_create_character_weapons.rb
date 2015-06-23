class CreateCharacterWeapons < ActiveRecord::Migration
  def change
    create_table :character_weapons do |t|
      t.belongs_to :character, index: true
      t.belongs_to :weapon, index: true
    end
  end
end