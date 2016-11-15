class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string :title
      t.string :description
      t.date :due_date
      t.boolean :done

      t.timestamps null: false
    end
  end
end
