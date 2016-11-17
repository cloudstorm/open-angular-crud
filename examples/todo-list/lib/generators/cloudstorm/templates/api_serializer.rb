class ApiSerializer < ActiveModel::Serializer
  link :self do
    href polymorphic_url([:api, :v1, object], only_path: true)
  end
end
