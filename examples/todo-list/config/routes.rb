Rails.application.routes.draw do
  devise_for :users
  ####################################################################################################
  # API
  ####################################################################################################

  root 'home#index'

  concern :semantic do
    collection do
      match '/', :action => :options, :via => [:options], :as => :options
    end
    member do
      match '/', :action => :member_options, :via => [:options], :as => :options
    end
  end

  ####################################################################################################

  namespace :api do
    namespace :v1 do
      resources :items
    end
  end
end
