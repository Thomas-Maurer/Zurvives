class Character < ActiveRecord::Base
  after_create :create_level

  belongs_to :user
  has_one :level

  has_many :character_games
  has_many :games, through: :character_games

  has_many :character_skills
  has_many :skills, through: :character_skills

  has_many :character_equipments
  has_many :equipments , through: :character_equipments


  def create_level
    self.level = Level.create
  end
end
