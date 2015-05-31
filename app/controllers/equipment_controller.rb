
class EquipmentController < ApplicationController
  def equipments
    render json: {equipments: Equipment.all}
  end

  def equipment
    render json: {equipments: Equipment.find(params[:id])}
  end

  def weapons
    render json: {weapons: Weapon.all}
  end

  def weapon
    render json: {weapons: Weapon.find(params[:id])}
  end
end