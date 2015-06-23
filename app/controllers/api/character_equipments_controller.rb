class Api::CharacterEquipmentsController < ApplicationController

  def add_equipment
    @character = Character.find(params[:character])
    @equipment = Equipment.find(params[:equipment])
    @character.equipments << @equipment

    render json: {message: 'added'}
  end

  def remove_equipment
    @character = Character.find(params[:character])
    @equipment = Equipment.find(params[:equipment])
    @character.equipments.delete(@equipment)
    render render json: {message: 'removed'}
  end

  def add_weapon
    @character = Character.find(params[:character])
    @equipment = Equipment.find(params[:equipment])
    CharacterWeapon.create(character_id: params[:character], weapon_id: params[:equipment])
  end

  def remove_weapon
    @character = Character.find(params[:character])
    @equipment = Equipment.find(params[:equipment])
    @weapon = CharacterWeapon.where(character_id: params[:character], weapon_id: params[:equipment]).first
    @weapon.remove
  end
end