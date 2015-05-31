
class EquipmentController < ApplicationController
  def get_special_ability
    SpecialAbility.find(Equipment.id)
  end
end