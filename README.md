Liste Envies [![Build Status](https://travis-ci.org/patou/liste-envies.svg?branch=master)](https://travis-ci.org/patou/liste-envies)
==================

test labeller 

Application pour créer la liste de ces envies, et la partager avec notre famille. Elle peut alors la voir et dire quel cadeaux elle souhaite offrir sans que nous pouvons la voir.

The application use :
- Google App Engine
- Angular
- Angular Material
- Sass


# Deployement :

* In travis environnement variable add theses var :
  * CLOUDSDK_CORE_PROJECT : Production app engine project id
  * CLOUDSDK_TEST_PROJECT : Test app engine project id
  * FIREBASE_SERVICE_ACCOUNT : The firebase service account private key in the JSON format (add '' arrount the json content)
  * GOOGLE_CLIENT_SECRET : Production app engine deploy private key (add '' arrount the json content)
  * GOOGLE_CLIENT_SECRET_TEST : Production app engine deploy private key (add '' arrount the json content)
  * VERSION_CORE_NAME : Version of the production application (master branch), in test, the version is the branch name.