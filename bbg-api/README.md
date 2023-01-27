# BBG API

## Installation and setup

`composer install`

Set `.env` values appropriate to the environment

## Library dependencies used by this project

- [Lighthouse](https://lighthouse-php.com/) for serving GraphQL from Laravel
- [Laravel Horizon](https://laravel.com/docs/8.x/horizon) for queue management and monitoring
- [Laravel Sanctum](https://laravel.com/docs/8.x/sanctum) to simplify token-based authentication
- [Laravel Telescope](https://laravel.com/docs/8.x/telescope) for debugging

## Starting a development environment

From the project root with [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running: 

`./vendor/bin/sail up`

After successful launch, find your local instance available at [http://bbg-api.test](http://bbg-api.test)

Find the Lighthouse GraphQL playground at [http://bbg-api.test/graphql-playground](http://bbg-api.test/graphql-playground)
