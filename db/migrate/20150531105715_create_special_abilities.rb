class CreateSpecialAbilities < ActiveRecord::Migration
  def change
    create_table :special_abilities do |t|
      t.string :description
      t.string :name
      t.timestamps null: false
    end
  end
end
