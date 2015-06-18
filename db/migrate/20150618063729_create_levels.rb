class CreateLevels < ActiveRecord::Migration
  def change
    create_table :levels do |t|
      t.references :character, index: true, foreign_key: true
      t.integer :level
      t.integer :exp
    end
  end
end
