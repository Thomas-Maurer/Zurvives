class Character < ActiveRecord::Base
  after_create :create_level
  before_destroy :destroy_level

  belongs_to :user
  has_one :level

  has_many :character_games
  has_many :games, through: :character_games

  has_many :character_skills
  has_many :skills, through: :character_skills

  has_many :character_equipments
  has_many :equipments ,  -> { uniq }, through: :character_equipments

  has_many :character_weapons
  has_many :weapons ,  -> { uniq }, through: :character_weapons

  def create_level
    self.level = Level.create
  end

  def destroy_level
    Level.find(self.level.id).destroy
  end
end
