class CreateCharacterGames < ActiveRecord::Migration
  def change
    create_table :character_games do |t|
      t.references :character, index: true, foreign_key: true
      t.references :game, index: true, foreign_key: true
    end
  end
end
