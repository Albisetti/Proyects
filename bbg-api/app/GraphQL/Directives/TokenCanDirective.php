<?php

namespace App\GraphQL\Directives;

use Closure;
use Exception;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Exceptions\DefinitionException;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;

class TokenCanDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<GRAPHQL
"""
Limit field and query access to users with certain token capabilities.
"""
directive @tokenCan(
  """
  The name of the capability authorized users need to have.
  """
  ability: String!
) on FIELD_DEFINITION
GRAPHQL;
    }

    public function handleField(FieldValue $fieldValue, Closure $next)
    {
        $originalResolver = $fieldValue->getResolver();

        return $next(
            $fieldValue->setResolver(
                function ($root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($originalResolver) {
                    $ability = $this->directiveArgValue('ability');
                    // Throw in case of an invalid schema definition to remind the developer
                    if ($ability === null) {
                        throw new DefinitionException("Missing argument 'ability' for directive '@tokenCan'.");
                    }

                    $abilities = explode(',', $ability);

                    $user = $context->user();
                    if (! $user) {
                        throw new Exception('You need to be logged in to view this resource.');
                    }

                    foreach ($abilities as $ability) {
                        if ($user->tokenCan($ability)) {
                            return $originalResolver($root, $args, $context, $resolveInfo);
                        }
                    }

                    throw new Exception('You do not have the required capability to view this resource.');
                }
            )
        );
    }
}