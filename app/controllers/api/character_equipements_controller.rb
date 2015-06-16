class Api::CharacterEquipementsController < ApplicationController

  def add_equipement
    @character = Character.find(params[:character])
    @equipement = Skill.find(params[:equipement])
    @character.equipements << @equipement
    @character.save

    render json: {message: 'added'}
  end

  def remove_skill
    @character = Character.find(params[:character])
    @equipement = Equipment.find(params[:equipement])
    @equipement.equipements.delete(@equipement)
    @character.save
    render render json: {message: 'removed'}
  end
end