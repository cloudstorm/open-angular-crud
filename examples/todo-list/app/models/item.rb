class Item < ActiveRecord::Base
  has_and_belongs_to_many :categories

  validates_presence_of :title
  validates_presence_of :due_date

  belongs_to :user
  validates_presence_of :user
  scope :for_user, -> (user) { where(user: user) }
end
