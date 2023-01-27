<?php

namespace App\GraphQL\Directives;

use App\GraphQL\Arguments\SaveModelWithFile;
use App\GraphQL\Arguments\SaveModelWithMedia;
use Illuminate\Database\Eloquent\Relations\Relation;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Directives\MutationExecutorDirective;


class CreateWithMediaDirective extends MutationExecutorDirective
{
    // TODO implement the directive https://lighthouse-php.com/master/custom-directives/getting-started.html

    public function name():string{
        return "createWithMedias";
    }

    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Create a new Eloquent model with the given arguments.
"""
directive @createWithMedias(
  """
  Specify the class name of the model to use.
  This is only needed when the default model detection does not work.
  """
  model: String

  """
  Specify the name of the relation on the parent model.
  This is only needed when using this directive as a nested arg
  resolver and if the name of the relation is not the arg name.
  """
  relation: String
) on FIELD_DEFINITION | ARGUMENT_DEFINITION | INPUT_FIELD_DEFINITION
GRAPHQL;
    }

    protected function makeExecutionFunction(?Relation $parentRelation = null): callable
    {

        return new SaveModelWithMedia($parentRelation, $this->directiveArgs['fileModel']);
    }
}
