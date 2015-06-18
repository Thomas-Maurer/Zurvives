class Character < ActiveRecord::Base
  after_create :create_level

  belongs_to :user
  has_many :skills, through: :character_skills
  has_many :equipements, through: :character_equipements
  has_one :level

  def create_level
    self.level = Level.create
  end
end
