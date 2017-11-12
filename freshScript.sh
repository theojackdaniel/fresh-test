#!/bin/bash

# This script supposes Python 2.7, Gcloud, Docker and NodeJS are installed in your environnement

# This is how I set my project with gcloud

# export PATH=$PATH:${PWD}/google-cloud-sdk/bin/
# gcloud init (choosing my project and region, us-central1-b for me)
# gcloud auth application-default login (click on your account in browser and authorize)
# gcloud config set project freshapptest-185721
# gcloud config set compute/zone us-central1-b 
# yes | gcloud components install kubectl (PATH should find its binary after install)


yarn
npm test;
if test $? -eq 0
then
    echo 'Creating NodeJS App Docker Image...'

    export PROJECT_ID="$(gcloud config get-value project -q)"

    docker build -t gcr.io/${PROJECT_ID}/${1}:${2} .
    
    # Cluster must containe at least 3 nodes
    gcloud container clusters create ${3} --num-nodes=3 --machine-type=f1-micro
    gcloud container clusters get-credentials ${3}

    kubectl run ${4} --image-pull-policy=IfNotPresent --image=gcr.io/${PROJECT_ID}/${1}:${2} --port 8080
    
    # Waiting for pod to launch
    sleep 15

    kubectl expose deployment ${4} --type=LoadBalancer --port 80 --target-port 8080

    # excessive pause needed, server is not always running otherwise
    sleep 60

    #Curl the service to check that server.js is launched
    export EXTERNALIP="$(kubectl describe services ${4} | grep "LoadBalancer Ingress:" | cut -d " " -f 7)"
    curl $EXTERNALIP:80

    # Recommandation: remove the following resources once you are done
    # to prevent unwanted charges incurring on your account
    # kubectl delete service fresh
    # gcloud compute forwarding-rules list
    # yes | gcloud container clusters delete myfresh-cluster --zone us-central1-b
    
    #export TIMESTAMP="$(docker images gcr.io/${PROJECT_ID}/${1} | grep  ${2} | 

    git add -A
    git commit -m "Image name: ${1}, Timestamp: N/A"

else
    echo 'Unit test did not pass, please check again'
fi

