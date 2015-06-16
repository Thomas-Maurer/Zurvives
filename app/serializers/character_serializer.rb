class CharacterSerializer < ActiveModel::Serializer
  attributes :id, :name

  belongs_to :user
  has_many :skills, through: :character_skills
end
