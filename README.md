<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [generator-node-crud-api](#generator-node-crud-api)
	- [Instalation](#instalation)
	- [CRUD APIs](#crud-apis)
		- [Create the project](#create-the-project)
		- [Create a model](#create-a-model)
		- [Run the server](#run-the-server)
		- [Creating not-CRUD endpoints](#creating-not-crud-endpoints)
	- [Domain APIs (not-CRUD)](#domain-apis-not-crud)
		- [Create the project](#create-the-project)
		- [Create an endpoint](#create-an-endpoint)
		- [Run the server](#run-the-server)
	- [Authentication](#authentication)
    - [Run the application with kong](#run-the-application-with-kong)
        - [Run the application locally](#run-the-application-locally)
        - [Kong administration](#kong-administration)
        - [Issuing a jwt](#issuing-a-jwt)
	- [Internal scripts](#internal-scripts)
		- [Domain APIs](#domain-apis)
		- [APIs with models](#apis-with-models)

<!-- /TOC -->

# generator-node-crud-api
This is a `yeoman` generator for `REST` APIs with `swagger`. It can generate two types of APIs:

* APIs that has a `mongo` domain model with CRUD operations for this models, but also can have or not other `endpoints`.
* APIs with `endpoints` that are not bounded to a database model.

In this README we will call the first one "CRUD APIs" and the second one "Domain APIs".

## Instalation

```sh
$ npm install -g yeoman
$ npm install -g generator-node-crud-api
```

## CRUD APIs

For this APIs the generator will create the base structure of the project and make the `scaffolding` of the `mongoose` models, generating  the `REST endpoints` with the `CRUD` operations of this models.

### Create the project

The first step is to execute the `yeoman` generator to create the project. It will ask the name of the project, if our API will have `CRUD` models and if we want it to install the npm dependencies for us.

```sh
$ yo node-crud-api

     _-----_     
    |       |    ╭──────────────────────────╮
    |--(o)--|    │ Welcome to the fantastic │
   `---------´   │  EXO CRUD API generator! │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y `

? Project Name: awesome-api
? Will you use models?: Yes
? Do you want me to install the npm dependencies?: Yes
```

After installing the dependencies we will have the next structure:

```
awesome-api
 |- docs -> This is the root folder for mkdocs
 |  |- index.md
 |
 |- tests
 |  |- hello-world
 |  |  |- test-hello-world.js
 |  |- vegetables
 |  |  |- test-vegetables.js
 |
 |- bin -> Here are the source of the npm script to manage the auth with kong.
 |
 |- lib
 |  |- models -> Add in this folder your mongoose models, one per file
 |  |  |- vegetables.js -> Example model
 |  |  |- index.js -> You'll need to import all your models here.
 |  |- routes -> Add in this folder your routes, one file per controller (This are not express routes, read ahead)
 |  |  |- hello-world.js -> Swagger routes for hello world, linked with x-swagger-router-controller
 |  |- hello-world -> Add one folder per controller, grouped by functionality, if needed
 |  |  |- index.js -> Example hello-world controller
 |  |- logger.js -> The logger for using in the whole app. Please do not use console.log
 |- swagger
 |  |- user.yaml -> swagger file to add non-crud endpoints
 |- app.js -> main express application
 |- build-baucis.js -> Internal file, please leave it as is.
 |- mkdocs.yml -> mkdocs index
 |- .env -> Here goes all the configuration to be loaded by dotenv
 |- package.json
 |- README.md -> Please write a nice one :)
 |- Dockerfile -> Dockerfile used by jenkins
 |- docker-compose.yml -> It will contain api, kong, kong-database, kong-dashboard and mongo as services
 |- Dockerfile
 |- Gruntfile.js
 |- unit.sh -> Commands for jenkins
```

### Create a model

For each model you want to create, add the corresponding javascript file in lib/model. That file must contain a [mongoose schema](http://mongoosejs.com/docs/guide.html).
For the generation of the swagger.json is necessary that the schema had the swaggerName property with the name that will appear on the model *definition* of the
swagger.json.
An example of this is the `lib/models/vegetables.js` file that is created.
Once the models are created, is very important to import them in `lib/models/index.js`. If the model isn't exported in `lib/models/index.js` its `CRUD endpoints` and
its swagger documentation won't be created.

### Run the server

To run the server you **MUST** execute:

```sh
$ npm start
```

This `npm` script before starting the application, builds the swagger.json file.

The application expects a `mongodb` instance running on `localhost:27017` without authentication, and will start listening on `http://localhost:3000`. These configurations can be changed in the `.env` file.

All the `CRUD endpoints` will be in the `/api/*` URI. For example the `vegetable` model will be in the URI `/api/vegetables`.

### Creating not-CRUD endpoints

[See create an endpoint](#create-an-endpoint)


## Domain APIs (not-CRUD)

For these APIs the generator creates the basic structure of the project and gives some basic utilities to generate the `swagger` documentation.

### Create the project

The first step is to execute the `yeoman` generator to create the project. It will ask the name of the project, if our API will have `CRUD` models and if we want it to install the npm dependencies for us. In the second question we answer no.

```sh
$ yo node-crud-api

     _-----_     
    |       |    ╭──────────────────────────╮
    |--(o)--|    │ Welcome to the fantastic │
   `---------´   │  EXO CRUD API generator! │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y `

? Project Name: awesome-api
? Will you use models?: No
? Do you want me to install the npm dependencies?: Yes
```

After installing the dependencies, the generated project will have the next structure.

```
awesome-api
 |- docs -> This is the root folder for mkdocs
 |  |- index.md
 |
 |- tests
 |  |- hello-world
 |  |  |- test-hello-world.js
 |
 |- bin -> Here are the source of the npm script to manage the auth with kong.
 |
 |- lib
 |  |- routes -> Add in this folder your routes, one file per controller (This are not express routes, read ahead)
 |  |  |- hello-world.js -> Swagger routes for hello world, linked with x-swagger-router-controller
 |  |- hello-world -> Add one folder per controller, grouped by functionality, if needed
 |  |  |- index.js -> Example hello-world controller
 |  |- logger.js -> The logger for using in the whole app. Please do not use console.log
 |- swagger
 |  |- user.yaml -> swagger file to add endpoints
 |- app.js -> main express application
 |- mkdocs.yml -> mkdocs index
 |- .env -> Here goes all the configuration to be loaded by dotenv
 |- package.json
 |- README.md -> Please write a nice one :)
 |- Dockerfile -> Dockerfile used by jenkins
 |- docker-compose.yml -> It will contain api, kong, kong-database and kong-dashboard as services
 |- Gruntfile.js
 |- unit.sh -> Commands for jenkins
```

### Create an endpoint

To create an `endpoint`, the first step is to document it using [swagger](http://swagger.io/). The generated project has a command to open the swagger editor:

```sh
$ npm run-script edit-domain-swagger
```

The swagger-editor will be open with the system default browser. The changes will be automatic saved.

![alt text](https://raw.githubusercontent.com/swagger-api/swagger-editor/master/docs/screenshot.png "Swagger editor")

In this file you have to define the `endpoint` in `swagger 2.0` format.

**Things to have in mind when writing an endpoint:**

- The `path` or `endpoint` defined on the `swagger` will link with the code through the `x-swagger-router-controller` property. This property must have the name of the file that will handle that route. This file must be in the `lib/routes` directory. For example, if the route of the API is `/api/hello` and the file that contain the functions of this routes is `lib/routes/hello-world.js`, the value of the `x-swagger-router-controller` property must be `hello-world`. This example is on the generated files.
- The operation (HTTP verb) of an `endpoint` defined on `swagger` (for example, `GET /hello` where the operation is `GET` and `/hello` is the `path`) must be linked through the `operationId` property. For example, if the written function in the code is named `hello`, that will be the value of `operationId` and that function must be on the file `lib/routes/hello-world.js` .
- This function is like an `express` route and is defined like: `function hello(req, res, next) {}`. In this function the parameters will be accessed through the `req.swagger` property ([more info](https://github.com/apigee-127/swagger-tools/blob/master/docs/Middleware.md#swagger-20)). This object has this structure:
  - `apiPath`: `string` The API's path (The key used in the `paths` object for the corresponding API).
  - `path`: `object` The corresponding path in the Swagger object that the request maps to.
  - `operation`: `object` The corresponding operation in the API Declaration that the request maps to.
  - `operationParameters`: `object[]` The computed parameters for this operation.
  - `operationPath`: `string[]` The path to the operation.
  - `params`: `object` For each of the request parameters defined in your Swagger document, its `path`, its `schema` and its processed `value`. *(In the event the value needs coercion and it cannot be converted, the `value` property will be the original value provided)*.
  - `security`: `object[]` The computed security for this request.
  - `swaggerObject`: `object` The Swagger object.

An example of this, can be seen in the generatred code for the `hello-world` endpoint ([more info](https://github.com/apigee-127/swagger-tools/blob/master/docs/Middleware.md#swagger-20)).

### Run the server

The server **MUST** be run with the next command:

```sh
$ npm start
```

This `npm script` runs all the needed task to generate the `swagger.json`.

Once running, the server by default will be listening on `http://localhost:3000`. These configurations can be changed in the `.env` file.

All the `endpoints` will be on the URI `/api/*`. The generator brings an example endpoint on `/api/hello`.

## Authentication

The users of the aplication will be authenticated using [json web tokens](https://jwt.io/introduction/). Said jwt
will be obtained using the authentication service (this service is on development right now, for testing purpose use the `npm script`
[sign-jwt](#issuing-a-jwt)).

The jwt can be sent on the *Authorization Header* of the HTTP request with the next format:

```
HTTP Headers
Authorization: Bearer XXXXXX
```

Where the `XXXXXX` is the received jwt.

It can also be sent in the query string of the request with the format ?jwt=*XXXXXX*.

The jwt will be validated by the kong that acts as a reverse proxy of the api. The api must assume that all he received
request will be with an right jwt. The authorization will be responsibility of the api.

## Run the application with kong

We will use [kong](https://getkong.org/) as the reverse proxy. The generated project contains a `docker-compose.yml` on the root directory.
This will have the services kong, kong-dashboard, kong-database and api. In the case that the project also contains mongoose models
a mongo service will found on the compose. The api service will be built using the Dockerfile found on the root directory.
The api service has already configured the environment variables the same way of the `.env` file. If you add new environment
variables add them to the compose file.

### Run the application locally

If you want to run the api locally you have to comment using **#** on the service api. Verify that the mongo service exposes
the port 27017. When adding the api to kong you should use your public ip and not *localhost*.

### Kong administration

#### Register an api

Once you had run `docker-compose up`, you should wait between 1 and 3 minutes until the kong database gets started.
The generated project has a `npm script` for adding an api to kong, said script is run with `npm run-script kong-register-api`
This command has the parameters:

- `--kong-url`: The url where the kong is listening. The default url of the `docker-compose.yml` is **http://localhost:8001**.
- `--api-name`: Name which the kong will recognize the api.
- `--upstream-url`: The url where the api we want to add is listening. If the api is running as a compose service can be
register as http://*serviceName*:*port*.

Example:

```sh
npm run-script kong-register-api -- --kong-url http://localhost:8001 --api-name hello --upstream-url http://api:3000
```

In case of missing parameters they will be asked to the user.

#### Register a consumer

The generated project has a `npm script` for adding consumers to kong, said script is run with `npm run-script kong-register-consumer`
This command has the parameters:

- `--kong-url`: The url where the kong is listening. The default url of the `docker-compose.yml` is **http://localhost:8001**.
- `--secret`: The secret that will be used to sign the jwt of the consumer. If no secret is passed the script will suggest an auto-generated random secret.
- `--username`: The name of the consumer.

Example:

```sh
npm run-script kong-register-user -- --kong-url http://localhost:8001 --username agustinc --secret Shhhh
```

You will obtain the kong issuer and the secret (Both are important to issue a jwt).

```sh
Consumer created!
Jwt keys created!

Issuer: 4B5fy2FM_tcOiVCAvlJJb7I6vcgy_pIyRiawBNGPS-4
Secret: Shhhh
```

In case of missing parameters they will be asked to the user.

### Issuing a jwt

The generated project has a `npm script` for issuing a jwt, said script is run with `npm run-script sign-jwt`.
This command has the parameters

- `--username`: The name of the consumer.
- `--audience`: The audience of the jwt.
- `--notBefore`: Not before parameter.
- `--expires`: Expiration time of the jwt.
- `--issuer`: The issuer got from the `kong-register-consumer` command.
- `--secret`: The secret got from the `kong-register-consumer` command.
- `--object`: The path of a json file that contains the user object to sign. If no path is given the next user will be signed

```javascript
{
    scopes: ['admin', 'developer', 'some-model:write', 'other-model:read'],
    name: 'reinaldo',
    mail: 'mostaza@racing.com'
}
```

Example:

```sh
npm run-script sign-jwt -- --username agustinc --secret Shhhh --issuer 4B5fy2FM_tcOiVCAvlJJb7I6vcgy_pIyRiawBNGPS-4 \
                           --notBefore 1s --expires 2y --audience http://localhost:8000
```

You will obtain the jwt:

```sh
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiYWRtaW4iLCJkZXZlbG9wZXIiLCJzb21lLW1vZGVsOndyaXRlIiwib3RoZXItbW9kZW
w6cmVhZCJdLCJuYW1lIjoicmVpbmFsZG8iLCJtYWlsIjoibW9zdGF6YUByYWNpbmcuY29tIiwiaWF0IjoxNDc2OTI3ODU5LCJuYmYiOjE0NzY5Mjc4NjAsIm
V4cCI6MTU0MDA0MzA1OSwiYXVkIjoibG9jYWxob3N0OjgwMDAiLCJpc3MiOiI0QjVmeTJGTV90Y09pVkNBdmxKSmI3STZ2Y2d5X3BJeVJpYXdCTkdQUy00Ii
wic3ViIjoiYWd1c3RpbmMiLCJqdGkiOiJhZ3VzdGluYyJ9.qAvGhV6lZgaFJaCGIl9bcGU7PDHz-K_wjKSLcReMtuk
```

This jwt can be used as described in [Authentication](#authentication)

In case of missing parameters they will be asked to the user.

## Internal scripts

The project created came with some scripts that we hadn't talked about yet. This scripts are for debug utility.

### Domain APIs

- `generate-domain-swagger`: Generate a `json` file from the `user.yaml` edited with swagger-editor. If there are no models
this file will be served as the `swagger.json` of the api.

### APIs with models

To the command described before we add:

- `generate-crud-swagger`: Generate a `json` file from the baucis models definition.
- `merge-swagger`: Merge the `json` file generated from the domain documentation with the one generated from the baucis models.
In case of conflicts the properties from the domain documentation have the priority. El `swagger.json` generado es el que usará la API.
This file will be served as the `swagger.json` of the api

For both types the command `npm start` will run internally all these tasks and then execute `node app.js`.