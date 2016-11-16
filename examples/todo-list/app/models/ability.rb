class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)

    can :manage, Category
    can :manage, Item, user_id: user.id
    can :read, User
  end
end
