class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.references :user, index: true, foreign_key: true
      t.string :name
      t.boolean :finish
      t.integer :turn, index: true
    end
  end
end
