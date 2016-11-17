user = User.create! email: 'cloudstorm@example.com', password: 'cloudstorm', password_confirmation: 'cloudstorm'

categories = Category.create([{name: 'High prio'}, {name: 'Low prio'}])
