<?php

namespace App\GraphQL\Directives;

use App\GraphQL\Arguments\SaveModelWithFile;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Illuminate\Database\Eloquent\Relations\Relation;
use Nuwave\Lighthouse\Execution\Arguments\SaveModel;
use Nuwave\Lighthouse\Execution\Arguments\UpdateModel;
use Nuwave\Lighthouse\Schema\Directives\MutationExecutorDirective;

// Based off vendor/nuwave/lighthouse/src/Schema/Directives/UpdateDirective.php
class UpdateWithFilesDirective extends MutationExecutorDirective
{

    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Update an Eloquent model with the input values of the field.
"""
directive @updateWithFile(
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
        return new UpdateModel(new SaveModelWithFile($parentRelation, $this->directiveArgs['fileModel']));
    }
}
