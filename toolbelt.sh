#!/bin/sh

show_help(){
    echo "
    Why Hello there! You must be looking for help\n\
    \n\
    The Flags: \n\
    r - run \n\
    t - test \n\
    a - run and build \n\
    d - deploy\n\
    c - continous integration
    \n\
    Chain em together as you see fit \n\
    "
}

setup(){
    curl -O https://storage.googleapis.com/appengine-sdks/featured/google_appengine_1.9.14.zip;
    unzip -q google_appengine_1.9.14.zip;
}

run(){
    google_appengine/dev_appserver.py ./app.yaml;
}

try(){
    return
}

deploy(){
    return
}

ci(){
    try;
    deploy;
    return 1;
}

while getopts "h?arcdx:" opt; do
    case "$opt" in
    h|\?)
        show_help
        ;;
    d)  deploy
        ;;
    r)  run
        ;;
    b)  build
        ;;
    c)  ci
        ;;
    esac
done
