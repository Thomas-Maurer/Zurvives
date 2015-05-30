class CreateSkillsTables < ActiveRecord::Migration
  def change
    create_table :skills do |t|
      t.string :name
      t.text :description
      t.string :skill_type
      t.integer :nb
      t.timestamps
    end
  end
end
