class CreateCharacters < ActiveRecord::Migration
  def change
    create_table :characters do |t|
      t.string :name
      t.belongs_to :user, index: true
      t.belongs_to :level, index: true
      t.timestamps
    end
  end
end
