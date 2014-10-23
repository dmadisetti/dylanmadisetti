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
    p - ci push
    c - clean
    \n\
    Chain em together as you see fit \n\
    "
}

setup(){
    sudo pip install nose
    curl -O https://storage.googleapis.com/appengine-sdks/featured/google_appengine_1.9.14.zip;
    unzip -q google_appengine_1.9.14.zip;
}

run(){
    google_appengine/dev_appserver.py ./app.yaml;
}

try(){
    ./test.py;
}

deploy(){
    echo $PASSWORD | google_appengine/appcfg.py --email=dylan.madisetti@gmail.com --passin update ./
}

push(){
    try;
    deploy;
}

clean(){
    rm google_appengine*;
    rm -r *.pyc;
}

while getopts "h?rtpcdx:" opt; do
    case "$opt" in
    h|\?)
        show_help
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
