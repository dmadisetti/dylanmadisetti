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
    p - ci push\n\
    c - clean\n\
    m - manual deploy\n\
    e - letsencrypt certificate\n\
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
    mkdir -p static/challenge;
}

run(){
    google_appengine/dev_appserver.py --allow_skipped_files 1 ./app.yaml;
}

try(){
    nosetests --with-gae --gae-lib-root=google_appengine --gae-application=./;
}

manual(){
    google_appengine/appcfg.py --email=dylan.madisetti@gmail.com update ./
}

encrypt(){
    echo "Run 'letsencrypt-auto -a manualcertonly' Agree to everything, and right before it verifies, paste the key/secret in here and hit enter: "
    read secret
    echo $secret > static/challenge/$(echo $secret | grep -oP ^[^\.]*)
    manual && {
        echo "Hit enter on other terminal now.\n Did it work?"
        read verified

        sudo cat /etc/letsencrypt/live/www.dylanmadisetti.com/fullchain.pem > cert.pem;
        sudo openssl rsa -inform pem -in /etc/letsencrypt/live/www.dylanmadisetti.com/privkey.pem -outform pem > key.pem;
        echo 'Also most there. Upload keys to GAE: https://console.cloud.google.com/appengine/settings/certificates'

    } || {
        echo "Something broke....";
    }
}

deploy(){
    echo $PASSWORD | google_appengine/appcfg.py --no_oauth2 --email=dylan.madisetti@gmail.com --passin update ./
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
    rm static/challenge/*;
}

while getopts "h?rtpscdmex:" opt; do
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
    m)  manual
        ;;
    e)  encrypt
        ;;
    esac
done
