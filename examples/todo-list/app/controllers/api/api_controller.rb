class API::APIController < ActionController::Base

  check_authorization

  respond_to :json

  before_action :set_collection, only: [:index]
  before_action :set_resource, only: [:show, :edit, :update, :destroy, :member_options]

  before_action :deserialize_resource, only: [:update, :create]

  ####################################################################################################

  def self.set_resource_type(resource)
    define_method :resource_type, -> { resource }
  end

  ####################################################################################################

  def options
    # TODO: fill with real options
    @options = {
      fields: resource_type.columns.map{ |c| [name: c.name, type: c.type]}
    }

    respond_to do |format|
      format.jsonapi { render jsonapi: @options }
    end
  end

  ####################################################################################################

  def member_options
    @options = {
      fields: resource_type.columns.map{ |c| [name: c.name, type: c.type]}
    }

    respond_to do |format|
      format.jsonapi { render jsonapi: @options }
    end
  end

  ####################################################################################################

  def index
    authorize! :index, resource_type
    respond_to do |format|
      format.jsonapi { render jsonapi: @resources, include: include_params }
    end
  end

  ####################################################################################################

  def show
    authorize! :show, @resource
    respond_to do |format|
      format.jsonapi { render jsonapi: @resource, include: include_params }
    end
  end

  ####################################################################################################

  def new
    @resource = resource_type.new
    respond_to do |format|
      format.jsonapi { render jsonapi: @resource }
    end
  end

  ####################################################################################################

  def edit
    respond_to do |format|
      format.jsonapi { render jsonapi: @resource }
    end
  end

  ####################################################################################################

  def create
    authorize! :create, resource_type
    build_resource
    @resource.save
    respond_to do |format|
      format.jsonapi {
        if @resource.persisted?
          render jsonapi: @resource
        else
          render jsonapi: @resource, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
        end
      }
    end
  end

  ####################################################################################################

  def update
    authorize! :update, @resource

    resource_type.transaction do
      @resource.update(@object)
    end

    respond_to do |format|
      format.jsonapi {
        if @resource.valid?
          render jsonapi: @resource, include: include_params
        else
          render jsonapi: @resource, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
        end
      }
    end
  end

  ####################################################################################################

  def destroy
    authorize! :destroy, @resource
    @resource.destroy
    respond_to do |format|
      format.jsonapi {
        if destroyed?(@resource)
          render jsonapi: @resource
        else
          render jsonapi: @resource, status: 422, serializer: ActiveModel::Serializer::ErrorSerializer
        end
      }
    end
  end

  ####################################################################################################
  private
  ####################################################################################################

  def destroyed?(resource)
    if @resource.respond_to?(:paranoia_destroyed?)
      @resource.paranoia_destroyed?
    else
      @resource.destroyed?
    end
  end

  ####################################################################################################

  def set_collection
    if @includes
      @collection ||= resource_type.includes(@includes)
    else
      @collection ||= resource_type
    end

    if @collection.respond_to? :ransack
      @resources = @collection.ransack(search_params).result
    else
      @resources = (@collection.respond_to?(:all) ? @collection.all :  @collection)
    end
  end

  ####################################################################################################

  def set_resource
    @resource = resource_type.find(params[:id])
  end

  ####################################################################################################

  def deserialize_resource
    @object = ActiveModelSerializers::Deserialization.jsonapi_parse!({"data" => resource_params.to_hash})
  end

  def build_resource
    @resource = resource_type.new(@object)
  end

  ####################################################################################################

  def resource_params
    # params.permit(:id, :type, :attributes, :relationships)
    params
  end

  ####################################################################################################

  def filter_params
    params.permit(:name)
  end

  ####################################################################################################

  def include_params
    params[:include]
  end

  ####################################################################################################

  def search_params
    params[:q]
  end

  ####################################################################################################

end
