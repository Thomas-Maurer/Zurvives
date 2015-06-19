class CharacterSerializer < ActiveModel::Serializer
  attributes :id, :name

  has_one :user
  has_many :skills, through: :character_skills
  has_many :equipments, through: :character_equipments
  has_one :level
end
