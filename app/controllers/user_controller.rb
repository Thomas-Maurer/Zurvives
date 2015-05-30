class UserController < ApplicationController

  def post_params
    params.require(:user).permit(:id, :email)
  end

  def getUser
    render json: {user: current_user}
  end

end
