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
    pip install webtest
    export FILE=$(curl https://storage.googleapis.com/appengine-sdks/ | grep -oP '(?<=featured/)google_appengine_[^\<]*' | head -1)
    curl -O https://storage.googleapis.com/appengine-sdks/featured/$FILE;
    unzip -q $FILE;
}

run(){
    google_appengine/dev_appserver.py --allow_skipped_files 1 ./app.yaml;
}

try(){
    nosetests --with-gae --gae-lib-root=google_appengine --gae-application=./;
}

deploy(){
    echo $PASSWORD | google_appengine/appcfg.py --email=dylan.madisetti@gmail.com --noauth_local_webserver --passin update ./
}

push(){
    try || exit 1;
    git branch | grep "\*\ [^(master)\]" || {
        deploy;
    }
}

clean(){
    rm -rf google_appengine*;
    rm -rf *.pyc;
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
