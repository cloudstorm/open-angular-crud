class CategorySerializer < ApiSerializer
  # Whitelist all attributes
  def attributes(requested_attrs = nil, reload = false)
    object.attributes
  end 
end