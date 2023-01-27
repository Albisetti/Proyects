<?php

namespace App\GraphQL\Mutations;

use App\Models\Organizations;
use Illuminate\Support\Facades\DB;
use function Sentry\startTransaction;

class MassUpdateOrganization
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver

        $organizations = collect([]);

        DB::beginTransaction();

        try {
            if( $args['organizations'] ) {
                foreach ( $args['organizations'] as $organizationFields ){
                    if(!isset($organizationFields['id'])) throw new \Exception('No Organization Found');
                    $organization = Organizations::findorFail($organizationFields['id']);

                    $fillableFields = $organization->getFillable();
                    $argCollection = collect($organizationFields);

                    foreach ($fillableFields as $field) {
                        //if (in_array(trim($field), $args)) { => in_array do not work with associative array
                        if($argCollection->has($field) && $field !== 'id'){
                            $organization->$field = $organizationFields[$field];
                        }
                    }

                    $organization->save();
                    $organization->refresh();

                    if (isset($argCollection['territoryManagers'])) {

                        foreach ($argCollection['territoryManagers'] as $connectionType => $connectionsData) {
                            switch ($connectionType) {
                                case 'sync':
                                    $organization->territoryManagers()->sync($connectionsData);
                                    break;
                                case 'syncWithoutDetaching':
                                    $organization->territoryManagers()->syncWithoutDetaching($connectionsData);
                                    break;
                                case 'disconnect':
                                    $organization->territoryManagers()->detach($connectionsData);
                                    break;
                                default:
                                    throw new \Exception("Relation connection not supported");
                            }
                        }
                    }
                    $organization->save();
                    $organization->refresh();

                    $organizations->push($organization);
                }
            }

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }

        return $organizations;
    }
}
