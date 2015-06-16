class CreateCharacterSkill < ActiveRecord::Migration
  def change
    create_table :character_skills do |t|
      t.belongs_to :character, index: true
      t.belongs_to :skill, index: true
    end
  end
end
