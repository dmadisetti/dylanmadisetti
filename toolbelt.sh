#!/bin/sh

show_help(){
    echo "
    Why Hello there! You must be looking for help\n\
    \n\
    The Flags: \n\
    r - run \n\
    t - test \n\
    d - deploy \n\
    s - setup\n\
    p - ci push
    c - clean
    \n\
    Chain em together as you see fit \n\
    "
}

setup(){
    pip install nosegae
    curl -O https://storage.googleapis.com/appengine-sdks/featured/$GAE.zip;
    unzip -q google_appengine_1.9.14.zip;
}

run(){
    google_appengine/dev_appserver.py ./app.yaml;
}

try(){
    nosetests --with-gae --gae-lib-root=google_appengine --gae-application=./;
}

deploy(){
    echo $PASSWORD | google_appengine/appcfg.py --email=dylan.madisetti@gmail.com --passin update ./
}

push(){
    try || exit 1;
    deploy;
}

clean(){
    rm google_appengine*;
    rm -r *.pyc;
}

while getopts "h?rtpscdx:" opt; do
    case "$opt" in
    h|\?)
        show_help
        ;;
    s)  setup
        ;;
    d)  deploy
        ;;
    r)  run
        ;;
    t)  try
        ;;
    p)  push
        ;;
    c)  clean
        ;;
    esac
done
