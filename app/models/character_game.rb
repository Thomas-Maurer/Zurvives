class CharacterGame < ActiveRecord::Base
  belongs_to :character
  belongs_to :game
end
