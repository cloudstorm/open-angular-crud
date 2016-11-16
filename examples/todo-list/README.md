# How to run the demo application locally

1. Clone the repository
2. Make sure you have `docker` and `docker-compose` available
3. Navigate to `examples/todo-list`
4. execute `docker-compose build`
5. execute `docker-compose up -d`
6. execute `docker-compose run --rm web bundle exec rake db:migrate`

The app should be available on `docker_machine_ip:port` where `docker_machine_ip` is the IP address of the docker host, and `port` is 3000 (as specified in the docker-compose.yml file)


Files that should be created by a generator (`rails generate cloudstorm:install`):
* app/assets/javascripts/resources/resources.js.coffee
* app/assets/javascripts/templates/todo_list_index_base-html-haml
* app/assets/javascripts/applications/todoList.js.coffee
* app/controllers/api/api_controller.rb
* app/serializers/api_serializer.rb
