<?php

namespace App\GraphQL\Directives;

use Closure;
use GraphQL\Language\AST\FieldDefinitionNode;
use GraphQL\Language\AST\ObjectTypeDefinitionNode;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Nuwave\Lighthouse\Execution\DataLoader\BatchLoaderRegistry;
use Nuwave\Lighthouse\Execution\DataLoader\PaginatedRelationLoader;
use Nuwave\Lighthouse\Execution\DataLoader\RelationBatchLoader;
use Nuwave\Lighthouse\Execution\DataLoader\SimpleRelationLoader;
use Nuwave\Lighthouse\Schema\AST\DocumentAST;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Directives\BelongsToManyDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldManipulator;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;
use Nuwave\Lighthouse\Support\Contracts\FieldResolver;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class ThreeWayBelongsToManyDirective extends BelongsToManyDirective
{

    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Resolves a field through the Eloquent `BelongsToMany` relationship.
"""
directive @threeWayBelongsToMany(
  """
  Specify the relationship method name in the model class,
  if it is named different from the field in the schema.
  """
  relation: String

  """
  Apply scopes to the underlying query.
  """
  scopes: [String!]

  """
  Allows to resolve the relation as a paginated list.
  """
  type: ThreeWayBelongsToManyType

  """
  Allow clients to query paginated lists without specifying the amount of items.
  Overrules the `pagination.default_count` setting from `lighthouse.php`.
  """
  defaultCount: Int

  """
  Limit the maximum amount of items that clients can request from paginated lists.
  Overrules the `pagination.max_count` setting from `lighthouse.php`.
  """
  maxCount: Int

  """
  Specify a custom type that implements the Edge interface
  to extend edge object.
  Only applies when using Relay style "connection" pagination.
  """
  edgeType: String
) on FIELD_DEFINITION

"""
Options for the `type` argument of `@belongsToMany`.
"""
enum ThreeWayBelongsToManyType {
    """
    Offset-based pagination, similar to the Laravel default.
    """
    PAGINATOR

    """
    Cursor-based pagination, compatible with the Relay specification.
    """
    CONNECTION
}
GRAPHQL;
    }

    public function resolveField(FieldValue $value): FieldValue
    {
        $value->setResolver(
            function (Model $parent, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) {
                $relationName = $this->directiveArgValue('relation', $this->nodeName());

                $decorateBuilder = $this->makeBuilderDecorator($resolveInfo);
                $paginationArgs = $this->paginationArgs($args);

                /** @var \Illuminate\Database\Eloquent\Relations\Relation $relation */
                $relation = $parent->{$relationName}();
                $relationModels = $relation->get();

                $relationCombine = [];

                foreach ( $relationModels as $relationModel ){
                    if (!isset($relationCombine[$relationModel->id])){
                        $relationCombine[$relationModel->id] = [
                            'model'=>$relationModel,
                            'pivots'=>[]
                        ];

                        $relationCombine[$relationModel->id]['pivots'][] = $relationModel['pivot'];
                        unset($relationCombine[$relationModel->id]['model']['pivot']);
                    } else {
                        $relationCombine[$relationModel->id]['pivots'][] = $relationModel['pivot'];
                    }
                }

                //TODO: fix limitation and pagination
                $paginator = new LengthAwarePaginator($relationCombine, count($relationCombine), $paginationArgs->first, $paginationArgs->page);

                return $paginator;

//                $decorateBuilder($relation);
//
//                if ($paginationArgs !== null) {
//                    return $paginationArgs->applyToBuilder($relation);
//                } else {
//                    return $relation->getResults();
//                }
            }
        );

        return $value;
    }
}
