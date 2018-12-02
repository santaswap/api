#!/bin/bash
set -e

AUTHOR_NAME=$(git log -1 $TRAVIS_COMMIT --pretty="%aN")
CAPITAL_FIRST_NAME=${AUTHOR_NAME%% *}
FIRST_NAME=${CAPITAL_FIRST_NAME,,}
echo Author is $AUTHOR_NAME, first name is $FIRST_NAME

if [ $TRAVIS_PULL_REQUEST != "false" ]; then
    echo Not deploying serverless code on pull requests

else
    echo Deploying serverless project with code from branch: $TRAVIS_BRANCH
    [[ $TRAVIS_BRANCH = "master" ]] && STAGE="prod" || STAGE=$FIRST_NAME
    echo serverless deploy --stage $STAGE
    serverless deploy --stage $STAGE

fi
