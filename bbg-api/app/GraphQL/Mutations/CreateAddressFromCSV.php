<?php

namespace App\GraphQL\Mutations;
use App\Models\Addresses;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;
use League\Csv\CharsetConverter;

class CreateAddressFromCSV
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $file = $args['file'];

        if($file) {

            //TODO: Check file type
            //$file->get() returns content of file in string format

            $csv = Reader::createFromString($file->get());
            $csv->setHeaderOffset(0);

            /* From league/csv docs: detect UTF-8/UTF-16 */
            $input_bom = $csv->getInputBOM();
            if ($input_bom === Reader::BOM_UTF16_LE
                || $input_bom === Reader::BOM_UTF16_BE) {
                CharsetConverter::addTo($csv, 'utf-16', 'utf-8');
            }

            $headers = $csv->getHeader();
            $addresses = [];

            /* getRecords() is an iterable */
            foreach ($csv->getRecords() as $record) {
                $record = collect($record);

                try {
                    $address = new Addresses;
                    $fillableFields = $address->getFillable();

                    foreach ($fillableFields as $field) {
                        if($record->has($field)){
                            $address->$field = $record[$field];
                        }
                    }

//                    $address->save(); //TODO can we move this outside of loop, like that if one of them fails we don't import any of them?
                    $addresses[] = $address;

                } catch (\Exception $ex) {
                    throw new \Exception($ex->getMessage());
                }
            }

            DB::transaction(function() use ($addresses) {
                foreach ($addresses as $address) {
                    $address->save();
                }
            });

            return $addresses;
        }
    }
}
