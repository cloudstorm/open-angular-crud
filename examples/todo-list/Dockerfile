FROM ruby:2.2

MAINTAINER Bence Nagy "bence.nagy@cloudstorm.io"

# Set correct environment variables.
ENV HOME /root

# Install bower
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev npm nodejs nodejs-legacy
RUN npm install -g bower

RUN mkdir /home/app
WORKDIR /home/app
ADD Gemfile /home/app/Gemfile
ADD Gemfile.lock /home/app/Gemfile.lock
RUN bundle install
ADD . /home/app

# Clean up APT and bundler when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# set work dir to run rake commands
WORKDIR /home/app

RUN bundle exec rake bower:install
RUN bundle exec rake assets:precompile
