#!/bin/bash
DIRNAME=$(dirname "$0")

cd $DIRNAME
bundle exec ruby $DIRNAME/server.rb
