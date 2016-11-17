Rails.application.routes.draw do

  devise_for :users

  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :categories
      resources :users
      resources :items
    end
  end
end
