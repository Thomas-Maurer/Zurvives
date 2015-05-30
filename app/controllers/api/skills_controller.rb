class Api::SkillsController < ApplicationController

  def index
    @skills = Skill.all
    render json: @skills, each_serializer: SkillSerializer
  end

  def show
    @skill = Skill.find(params[:id])
    render json: @skill
  end

end