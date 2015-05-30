class SkillSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :skill_type, :nb
end
