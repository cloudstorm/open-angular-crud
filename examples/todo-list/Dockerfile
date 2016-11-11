FROM ruby:2.2

MAINTAINER Bence Nagy "bence.nagy@cloudstorm.io"

# Set correct environment variables.
ENV HOME /root

# Install npm, bower
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev node nodejs npm
RUN npm install -g bower

RUN mkdir /home/app
WORKDIR /home/app
ADD Gemfile /home/app/Gemfile
ADD Gemfile.lock /home/app/Gemfile.lock
RUN bundle install
ADD . /home/app
