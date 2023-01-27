# Searching

## Overview

- [MeiliSearch](https://github.com/meilisearch/MeiliSearch) is included in the BBG software stack, a Rust-based full text search engine with a simple API.
- MeiliSearch provides full-text search on _arbitrary documents_.
- Laravel provides a tight coupling with this search system, [Laravel Scout](https://laravel.com/docs/8.x/scout).
- Making models searchable is extremely straightforward with this library.
- With the default Laravel Sail configuration, find the MeiliSearch portal at [http://localhost:7700](http://localhost:7700). This will allow you to inspect and search an index.
- Lighthouse takes this a step further and allows our Laravel Scout Searchable models to expose their search through a `@search` directive within the GraphQL schema.
- By default, all fields are indexed.  Overriding a `Searchable` model's `toSearchableArray` function will [let you define which attributes are indexed](https://laravel.com/docs/5.3/scout#configuring-searchable-data).

## Adding search to a new model

Apply the `Searchable` trait to any model to inherit the required bevaviours for Laravel Scout's indexing and search:

```
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Something extends Model
{
    use HasFactory;
    use Searchable;
```

Additions, deletions, and updates to models inheriting this trait will persist automatically when Eloquent methods are called, though you can also mass import entire models as indexes:

## Indexing models manually

If you want to manually reindex all records for a given model, a command of the form:

`php artisan scout:index App\\Models\\Something`

will ensure that this index exists and is populated with all records of that model type.

## Using @search directive

With these in place, it is possible to apply the `@search` directive for text searches:

```
type Query {
    searchThings(search: String @search(model: "App\\Models\\Something")): [Something!]! @paginate
}
```

In this way, paginated search results can be attached to any Laravel model with ease.

## Utilizing search in GraphQL queries

Having followed the above process to add `Searchable` to the `Addresses` class, I revise the GraphQL schema and add a new `searchAddresses` query of the following form:

```
searchAddresses(search: String @search(model: "App\\Models\\Addresses")): [Address!]! @paginate(type: "connection" model: "App\\Models\\Addresses")
```

Because of the discrepancy between the model class name, `Addresses` and the type name, `Address`, we are required to specify the models explicitly on these directives; we could otherwise omit these.

A query making a paginated address search:

```
query {
  searchAddresses(search: "Walter", first: 5) {
    pageInfo {
      hasNextPage
      currentPage
      total
    }
    edges {
      node {
        id
        address
        address2
        city
        state {
          name
        }
        created_at
        updated_at
      }
    }
  }
}
```

and an example result set from this query:

```
{
  "data": {
    "searchAddresses": {
      "pageInfo": {
        "hasNextPage": true,
        "currentPage": 1,
        "total": 6
      },
      "edges": [
        {
          "node": {
            "id": "63",
            "address": "732 Walter Extensions\nNew Nina, TN 52048",
            "address2": "Suite 086",
            "city": "East Marty",
            "state": {
              "name": "New York"
            },
            "created_at": "2021-06-04 12:27:31",
            "updated_at": "2021-06-04 12:27:31"
          }
        },
        ...
      ]
    }
  }
}
```
