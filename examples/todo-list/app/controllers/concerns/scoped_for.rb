module ScopedFor
  module User
    extend ActiveSupport::Concern

    included do
      prepend_before_filter :preset_collection_for_scope, :only => [:index]
      before_filter :amend_user_to_resource, :only => [:create]
    end

    def preset_collection_for_scope
      @collection ||= resource_type.for_user current_user
    end

    def amend_user_to_resource
      @object[:user] = current_user
    end
  end
end
