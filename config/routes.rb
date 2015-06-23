Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'
  namespace :api do
    resources :skills
    resources :characters

    #character_skill
    post 'add_skill/:character/:skill'   => 'character_skills#add_skill'
    delete 'remove_skill/:character/:skill' => 'character_skills#remove_skill'

    #character_equipement
    post 'add_equipment/:character/:equipment'   => 'character_equipments#add_equipment'
    delete 'remove_equipment/:character/:equipment' => 'character_equipments#remove_equipment'

    post 'add_weapon/:character/:equipment'   => 'character_equipments#remove_weapon'
    delete 'remove_weapon/:character/:equipment' => 'character_equipments#remove_weapon'
  end
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
  root to: 'page#index'
  get 'game/:id' => 'page#index'
  get 'test_user' => 'profil#members_only'

  #Route API
  get 'api/getuser' => 'user#getUser'
  get 'api/equipments' => 'equipment#equipments'
  get 'api/equipments/:id' => 'equipment#equipment'
  get 'api/weapons/' => 'equipment#weapons'
  get 'api/weapons/:id' => 'equipment#weapon'
  get 'api/equipment/random_equip' => 'equipment#random_equip'

  # Will redirect all others path to angular config
  get '*path' => 'page#index'
end
