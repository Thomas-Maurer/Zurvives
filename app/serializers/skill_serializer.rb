class SkillSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :skill_type, :nb, :class_name

  def class_name
    object.name.parameterize.underscore.camelize
  end
end
