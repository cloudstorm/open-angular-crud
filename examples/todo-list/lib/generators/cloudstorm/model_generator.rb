module Cloudstorm
  module Generators
    class ModelGenerator < Rails::Generators::NamedBase
      include Rails::Generators::ModelHelpers

      source_root File.expand_path('../templates', __FILE__)

      desc 'Creates a full-stack cloudstorm entity'

      invoke :model

      argument :attributes, type: :array, default: [], banner: 'field[:type][:index] field[:type][:index]'

      #############################################################################

      def model
        add_routes
        create_serializer
        scope_model
        create_controller
        add_to_js_resources
        add_to_js_routes
        create_js_controller
        create_cs_descriptor
      end

      #############################################################################

      protected

      #############################################################################

      def application_name
        Rails.application.class.parent_name.camelize(:lower)
      end

      def model_path
        File.join('app/models', class_path, "#{file_name}.rb")
      end

      def controller_path
        File.join('app/controllers/api/v1', class_path, "#{file_name.pluralize}_controller.rb")
      end

      def serializer_path
        File.join('app/serializers', class_path, "#{file_name}_serializer.rb")
      end

      def js_controller_path
        File.join('app/assets/javascripts/controllers', "#{javascript_file_name}Ctrl.js.coffee")
      end

      def js_descriptor_path
        File.join('app/assets/javascripts/resources', "#{singular_name}.js.coffee")
      end

      def javascript_resource_name
        plural_name
      end

      def javascript_module_name
        "#{application_name}.resources.#{javascript_resource_name}"
      end

      def javascript_file_name
        singular_name.camelize(:lower)
      end

      def javascript_resource_modul_name
        plural_name.camelize(:lower)
      end

      def attribute_javascript_resource_name(name)
        name.pluralize
      end

      #############################################################################

      def add_routes
        resource_route = "      resources :#{plural_name}\n"
        if File.readlines('config/routes.rb').grep(/resource_route/).size.zero?
          insert_into_file 'config/routes.rb', after: "namespace :v1 do\n" do
            resource_route
          end
        end
      end

      #############################################################################

      def create_serializer
        template 'serializer.rb.erb', serializer_path
      end

      def create_controller
        template 'controller.rb.erb', controller_path
      end

      def create_js_controller
        template 'jsController.js.coffee.erb', js_controller_path
      end

      def create_cs_descriptor
        template 'descriptor.js.coffee.erb', js_descriptor_path
      end

      #############################################################################

      def add_to_js_resources
        if File.readlines('app/assets/javascripts/resources/resources.js.coffee').grep(/javascript_module_name/).size.zero?
          insert_into_file 'app/assets/javascripts/resources/resources.js.coffee', before: "])\n" do
            "\t'#{javascript_module_name}'\n"
          end
        end
      end

      #############################################################################

      def add_to_js_routes
        insert_into_file "app/assets/javascripts/applications/#{application_name}.js.coffee", before: "\n  # ----- /CloudStorm ---------------------------\n" do
          <<-HEREDOC.gsub /^ +/, ""
            \t).when("/#{plural_name}",
            \t  templateUrl: "#{application_name.underscore}_index_base.html"
            \t  controller: "#{class_name}Ctrl"\n
          HEREDOC
        end
      end

      #############################################################################

      def scope_model
        insert_into_file model_path, "\n", :before => "end\n"
      end

      #############################################################################

      def has_name_attribute?
        !!attributes.find { |a| a.name == 'name' }
      end

      def attribute_type(attribute)
        if attribute.type == :references
          "type: 'resource', resource: '#{attribute_javascript_resource_name(attribute.name)}', relationship: '#{attribute.name}'"
        else
          "type: '#{attribute.type}'"
        end
      end
    end
  end
end
