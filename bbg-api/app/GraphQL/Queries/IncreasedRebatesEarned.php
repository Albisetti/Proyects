<?php

namespace App\GraphQL\Queries;

use App\Helpers\ConversionHelpers;
use App\Models\Programs;

class IncreasedRebatesEarned
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $program = NULL;

        if(isset($args['program_id'])) {
            $program_id = $args['program_id'];

            $program = Programs::find($program_id);
            if(!$program) {
                throw new \Exception('Tried to retrieve conversion payments due for a bad program ID.');
            }
        }

        /* Pass false because we want only conversions that are *not* qualified. */
        $qualified_conversions = ConversionHelpers::getConversions($program, true);
        $conversions = [];

        foreach($qualified_conversions as $conversion) {
            $conversion_class = get_class($conversion);

			if($conversion_class === "App\\Models\\ConversionByActivity"
			&& $conversion->bonus_type === "rebate amount increase per unit") {
				$conversions[] = [
					'conversion' => $conversion,
					'program' => $conversion->program,
					'bonus_type' => 'rebate amount increase per unit',
					'increase' => [
						'residential' => $conversion->residential_bonus_amount,
						'multi_unit' => $conversion->multi_unit_bonus_amount,
						'commercial' => $conversion->commercial_bonus_amount
					],
					'date_achieved' => $conversion->qualifiedAt()
				];
			}
		}

		return $conversions;
    }
}
