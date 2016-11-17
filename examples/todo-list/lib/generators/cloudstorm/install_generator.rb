module Cloudstorm
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../templates', __FILE__)

      desc "Copy cloudstorm base files to your application."

      def create_api_serializer_file
        copy_file "api_serializer.rb", "app/serializers/api_serializer.rb"
      end

      def create_api_controller_file
        copy_file "api_controller.rb", "app/controllers/api/api_controller.rb"
      end

      def create_index_base_file
        copy_file "application_index_base.html.haml", "app/assets/javascripts/templates/#{application_name.underscore}_index_base.html.haml"
      end

      def create_application_js_file
        template "application.js.coffee.erb", "app/assets/javascripts/applications/#{application_name}.js.coffee"
      end

      def create_resources_file
        template "resources.js.coffee.erb", "app/assets/javascripts/resources/resources.js.coffee"
      end

      #############################################################################
      protected
      #############################################################################

      def application_name
        Rails.application.class.parent_name.camelize(:lower)
      end
    end
  end
end
