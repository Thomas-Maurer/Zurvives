class Api::CharactersController < ApplicationController

  def index
    @characters = current_user.characters
    render json: @characters, each_serializer: CharacterSerializer
  end

  def show
    @character = current_user.characters.where(id: params[:id]).first
    render json: @character, each_serializer: CharacterSerializer
  end

  def create
    @character = Character.new(character_params)
    @character.user = current_user
    @character.save

    render json: @character, each_serializer: CharacterSerializer
  end

  def update
    @character =  current_user.characters.where(id: params[:id]).first
    @character.update(character_params)

    render json: @character, each_serializer: CharacterSerializer
  end

  def destroy
    Character.find(params[:id]).destroy
    render json: {message: 'destroy'}
  end

  private

  def character_params
    params.require(:characters).permit(:name, skill_ids: [])
  end

end