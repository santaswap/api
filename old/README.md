[![Build Status][travis-badge]][travis-badge-url]
# Santa Swap API
This serverless application is the API for the Santa Swap UI application.

# What it does
This project uses [Travis-CI](https://travis-ci.org/santaswap/ui) to automatically create new infrastructure whenever a new branch is created, and to update that infrastructure with each commit on the branch.  See the [.travis.yml](https://github.com/santaswap/api/blob/master/.travis.yml) and [.travis-deploy.sh](https://github.com/santaswap/api/blob/master/.travis-deploy.sh) files for more information about how this has been configured.

# How to use it
This project is built with the [Serverless Framework](https://serverless.com/) - see their documentation for more about the tool and how to use it.

# Production architecture overview
![santa swap api - architecture overview](https://cloud.githubusercontent.com/assets/2955468/24731461/3b03a3b0-1a38-11e7-9025-3c54416d6601.png)

[travis-badge]: https://travis-ci.org/santaswap/api.svg?branch=master		
[travis-badge-url]: https://travis-ci.org/santaswap/api	
