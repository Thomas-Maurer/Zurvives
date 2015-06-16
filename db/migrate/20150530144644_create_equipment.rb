class CreateEquipment < ActiveRecord::Migration
  def change
    create_table :equipments do |t|
      t.string :name
      t.text :description
      t.string :image
      t.integer :actable_id
      t.string  :actable_type
      t.belongs_to :special_ability, index: true
      t.timestamps null: false
    end
  end
end
