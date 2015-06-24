class Level < ActiveRecord::Base
  belongs_to :character
  after_initialize :init

  def init
    self.level  ||= 0
  end
end
