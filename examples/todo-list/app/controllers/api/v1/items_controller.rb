class API::V1::ItemsController < API::APIController
  set_resource_type Item

  include ScopedFor::User
end
