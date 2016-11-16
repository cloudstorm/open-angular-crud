class AddColumnUserIdToItems < ActiveRecord::Migration
  def change
    add_column :items, :user_id, :integer
  end
end
