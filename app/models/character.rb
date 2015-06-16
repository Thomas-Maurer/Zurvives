class Character < ActiveRecord::Base
  belongs_to :user
  has_many :skills, through: :character_skills
  has_many :equipements, through: :character_equipements
end
