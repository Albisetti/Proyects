<?php

namespace App\GraphQL\Mutations;

use App\Models\Organizations;
use App\Models\OrganizationCustomProduct;
use App\Models\ProgramParticipants;

class UpdateOrganizationProgramOverwrites
{
    /**
     * Update a builder's program overwrites, cascading those updates down
     * to any already existing builder-program custom products.
     *
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        /*
         * $args = [
         *     "id" => ORGANIZATION_ID,
         *     "programOverwrites" => [
         *         "commercial_rebate_overwrite": 16
         *         "id": 53
         *         "multi_unit_rebate_overwrite": 17
         *         "overwrite_amount_type": "AMOUNT"
         *         "residential_rebate_overwrite": 15
         *         "volume_bbg_rebate": null
         *     ]
         * ]
         *
         * No type-validations necessary here as already enforced at the schema level.
         */
        $id = $args['id'];
        $programs = $args['input'];
		$organization = Organizations::where('id', $id)->first();
		if(!$organization) {
			throw new \Exception('Trying to update organization-program overwrites for nonexistent organization.');
		}

        foreach($programs as $program) {
            $program_id = $program['program_id'];

            /* Arguments are optional, we must validate their existence. */
            $overwrite_amount_type =
                isset($program['overwrite_amount_type']) ? $program['overwrite_amount_type'] : NULL;
            $commercial_rebate_overwrite =
                isset($program['commercial_rebate_overwrite']) ? $program['commercial_rebate_overwrite'] : NULL;
            $multi_unit_rebate_overwrite =
                isset($program['multi_unit_rebate_overwrite']) ? $program['multi_unit_rebate_overwrite'] : NULL;
            $residential_rebate_overwrite =
                isset($program['residential_rebate_overwrite']) ? $program['residential_rebate_overwrite'] : NULL;
            $flat_builder_overwrite =
                isset($program['flat_builder_overwrite']) ? $program['flat_builder_overwrite'] : NULL;
            $flat_bbg_overwrite =
                isset($program['flat_bbg_overwrite']) ? $program['flat_bbg_overwrite'] : NULL;
            $volume_bbg_rebate =
                isset($program['volume_bbg_rebate']) ? $program['volume_bbg_rebate'] : NULL;

            /* Ensure participation exists in the program we're updating overwrites for. */
            $program_participant = ProgramParticipants::where('organization_id', $id)
                ->where('program_id', $program_id)
                ->first();
            if(!$program_participant) {
                throw new \Exception('Trying to update program overwrites for a non-existent builder-program participation.');
            }

            /* Update only the overwrites we have included with this mutation. */
            if(isset($overwrite_amount_type)) {
                $program_participant->overwrite_amount_type = $overwrite_amount_type;
            }

            if(isset($residential_rebate_overwrite)) {
                $program_participant->residential_rebate_overwrite = $residential_rebate_overwrite;
            }

            if(isset($multi_unit_rebate_overwrite)) {
                $program_participant->multi_unit_rebate_overwrite = $multi_unit_rebate_overwrite;
            }

            if(isset($commercial_rebate_overwrite)) {
                $program_participant->commercial_rebate_overwrite = $commercial_rebate_overwrite;
            }

            if(isset($flat_builder_overwrite)){
                $program_participant->flat_builder_overwrite = $flat_builder_overwrite;
            }

            if(isset($flat_bbg_overwrite)){
                $program_participant->flat_bbg_overwrite = $flat_bbg_overwrite;
            }

            if(isset($volume_bbg_rebate)) {
                $program_participant->volume_bbg_rebate = $volume_bbg_rebate;
            }

            /* Update the model. */
            $program_participant->save();

            /*
             * Try to find any matches for this program/product/organization and
             * on those models also write these values.
             */
            $custom_products = OrganizationCustomProduct::where('organization_id', $id)
                ->where('program_id', $program_id)
                ->get();
            foreach($custom_products as $custom_product) {
                if(isset($overwrite_amount_type)) {
                    $custom_product->overwrite_amount_type = $overwrite_amount_type;
                }

                if(isset($residential_rebate_overwrite)) {
                    $custom_product->residential_rebate_overwrite = $residential_rebate_overwrite;
                }

                if(isset($multi_unit_rebate_overwrite)) {
                    $custom_product->multi_unit_rebate_overwrite = $multi_unit_rebate_overwrite;
                }

                if(isset($commercial_rebate_overwrite)) {
                    $custom_product->commercial_rebate_overwrite = $commercial_rebate_overwrite;
                }

                if(isset($volume_bbg_rebate)) {
                    $custom_product->volume_bbg_rebate = $volume_bbg_rebate;
                }

                $custom_product->save();
            }
        }
        return $organization;
    }
}
