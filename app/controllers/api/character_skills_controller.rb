class Api::CharacterSkillsController < ApplicationController

  def add_skill
    @character = Character.find(params[:character])
    @skill = Skill.find(params[:skill])
    @character.skills << @skill
    @character.save

    render json: {message: 'added'}
  end

  def remove_skill
    @character = Character.find(params[:character])
    @skill = Skill.find(params[:skill])
    @character.skills.delete(@skill)
    @character.save
    render render json: {message: 'removed'}
  end
  private

  def character_params
    params.require(:character).permit(:name)
  end

end