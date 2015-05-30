class CreateWeapon < ActiveRecord::Migration
  def change
    create_table :weapons do |t|
      t.string :range
      t.integer :damage
      t.integer :dice
      t.integer :dice_to_success
      t.boolean :allow_open_door
      t.boolean :silent_kill
      t.boolean :silent_door
      t.boolean :ambidextry
    end
  end
end
