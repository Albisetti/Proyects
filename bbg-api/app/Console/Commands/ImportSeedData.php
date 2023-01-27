<?php

namespace App\Console\Commands;

use App\Models\ProductCategories;
use Illuminate\Console\Command;
use League\Csv\Reader;
use League\Csv\CharsetConverter;

use App\Models\Organizations;
use App\Models\Products;
use App\Models\State;
use Carbon\Carbon;

//TODO: remove null
class ImportSeedData extends Command
{
    const BUILDERS_SEED_FILENAME = 'builders2.csv';
    const PRODUCTS = 'products3.csv';
    const SUPPLIERS = 'suppliers2.csv';
    const TERRITORY_MANAGERS_SEED_FILENAME = 'territory_managers.csv';

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bbg:import-seed-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import the data seed set.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
		$parser = new \TheIconic\NameParser\Parser();
		$tiers_map = [
			'T1' => 'Tier 3',
			'T2' => 'Tier 2',
			'T3' => 'Tier 1'
		];
        $seed_data_directory = __DIR__ . '/../../../database/data/bbg_seed_data/';

        $csv = Reader::createFromPath($seed_data_directory . self::SUPPLIERS);
        $csv->setHeaderOffset(0);

        $input_bom = $csv->getInputBOM();
        if ($input_bom === Reader::BOM_UTF16_LE
            || $input_bom === Reader::BOM_UTF16_BE) {
            CharsetConverter::addTo($csv, 'utf-16', 'utf-8');
        }

        $csv->getHeader();
        foreach ($csv->getRecords() as $record) {
            $supplier = new Organizations;
            $supplier->id = $record['supplier_pivot'];
            if(empty($record['SupplierName'])) continue;
            $supplier->name = $record['SupplierName'];

			try {
				$supplier_name = $parser->parse($record['Primary Contact']);
				if( isset($supplier_name) && $supplier_name !== 'null' ){
                    $supplier->contact_first_name = $supplier_name->getFirstname();
                    $supplier->contact_last_name = $supplier_name->getLastname();
                }
			} catch(\Exception $ex) {
				if( isset($record['Primary Contact']) && $record['Primary Contact'] !== 'null' ) $supplier->contact_first_name = $record['Primary Contact'];
			}

            if( isset($supplier_name) && $record['Email'] !== 'null' ) $supplier->contact_email = $record['Email'];
            if( isset($supplier_name) && $record['Phone'] !== 'null' ) $supplier->contact_office_phone = $record['Phone'];
            $supplier->member_tier = 'none';
            if( isset($supplier_name) && $record['NOTES'] !== 'null' ) $supplier->notes = $record['NOTES'];

            if( isset($record['Type']) && ( $record['Type'] === 'Supplier' || $record['Type'] === 'Manufacturer' ) !== 'null' ) {
                $supplier->organization_type =  strtolower($record['Type']) . 's';
            } else {
                $supplier->organization_type = 'suppliers';
            }

			$supplier->contact_title = '';
			$supplier->contact_mobile_phone = '';
			$supplier->contact_office_phone_ext = '';
			$supplier->address = '';
			$supplier->address2 = '';
			$supplier->zip_postal = '';

            $supplier->save();
        }

        $csv = Reader::createFromPath($seed_data_directory . self::PRODUCTS);
        $csv->setHeaderOffset(0);

        $input_bom = $csv->getInputBOM();
        if ($input_bom === Reader::BOM_UTF16_LE
            || $input_bom === Reader::BOM_UTF16_BE) {
            CharsetConverter::addTo($csv, 'utf-16', 'utf-8');
        }

        $csv->getHeader();
        foreach ($csv->getRecords() as $record) {
			$product = new Products;
			if(isset($record['ID'])) $product->id = $record['ID'];
			if(isset($record['BBG Code'])) $product->bbg_product_code = $record['BBG Code'];
			$product->name = $record['ProductName'];

			if ( isset($record['Category']) ) {
                $productCategory = ProductCategories::firstOrCreate([
                    'name' => $record['Category']
                ]);
            } else {
                $productCategory = ProductCategories::firstOrCreate([
                    'name' => 'Miscellaneous'
                ]);
            }

			$product->category_id = $productCategory->id;

			if( isset($record['supplier_pivot']) ){
                $productSupplier = Organizations::where('id',$record['supplier_pivot'])->first();
            } else {
                if (isset($record['pivotID'])){
                    $productSupplier = Organizations::where('id', $record['pivotID'])->first(); //Unfornunatly this seems to be less confusing name for client, even though it is the most confusing one for us and generally does not tell us anything, in this specific case it is for supplier
                }
            }


			if($productSupplier) $product->supplier_id = $productSupplier->id;
			if(isset($record['Active']) && $record['Active'] == "FALSE")
				$product->deleted_at = new Carbon();
			$product->save();
        }

        /* Builders */
        $csv = Reader::createFromPath($seed_data_directory . self::BUILDERS_SEED_FILENAME);
        $csv->setHeaderOffset(0);

        $input_bom = $csv->getInputBOM();
        if ($input_bom === Reader::BOM_UTF16_LE
            || $input_bom === Reader::BOM_UTF16_BE) {
            CharsetConverter::addTo($csv, 'utf-16', 'utf-8');
        }

        $csv->getHeader();
        foreach ($csv->getRecords() as $record) {
			$builder = new Organizations;
            $builder->id = $record['ID'];

			if(isset($record['BBG_Code']) && $record['BBG_Code'] != "null")
				$builder->code = $record['BBG_Code'];
			else
				$builder->code = "";

			if(isset($record['MemberName']) && $record['MemberName'] != "null")
				$builder->name = $record['MemberName'];
			else
				$builder->name = "";

			try {
				$builder_name = $parser->parse($record['ContactName']);
                if( isset($builder_name) && $builder_name !== 'null' ) {
                    $builder->contact_first_name = $builder_name->getFirstname();
                    $builder->contact_last_name = $builder_name->getLastname();
                }
			} catch(\Exception $ex) {
                if( isset($record['Primary Contact']) && $record['Primary Contact'] !== 'null' ) $builder->contact_first_name = $record['Primary Contact'];
			}

			if(isset($record['ContactName']) && $record['ContactName'] != "null")
				$builder->contact_first_name = $record['ContactName'];
			else
				$builder->contact_first_name = "";

			if(isset($record['Email Address']) && $record['Email Address'] != "null")
				$builder->contact_email = $record['Email Address'];
			else
				$builder->contact_email = "";

			if(isset($record['Phone']) && $record['Phone'] != "null")
				$builder->contact_office_phone = $record['Phone'];
			else
				$builder->contact_office_phone = "";

			if(isset($record['Rebate Level']) && $record['Rebate Level'] != "null")
				if(in_array($record['Rebate Level'], array_keys($tiers_map)))
					$builder->member_tier = $tiers_map[$record['Rebate Level']];
			else
				$builder->member_tier = 'none';

			if(isset($record['Zip']) && $record['Zip'] != "null")
				$builder->zip_postal = $record['Zip'];
			else
				$builder->zip_postal = "";

			if(isset($record['City']) && $record['City'] != "null")
				$builder->city = $record['City'];
			else
				$builder->city = "";

			if(isset($record['Active']) && $record['Active'] == "FALSE")
				$builder->archived_at = new Carbon();
			if(isset($record['MemberSince']) && $record['MemberSince'] != "null") {
				$builder->created_at = new Carbon($record['MemberSince']);
			}

			if(isset($record['State1']) && $record['State1'] != "null") {
				$state = State::where('iso_code', '=', 'US-' . $record['State1'])
					->first();
				if($state) {
					$builder->state_id = $state->id;
				}
			}

			$builder->contact_title = '';
			$builder->contact_mobile_phone = '';
			$builder->contact_office_phone_ext = '';
			$builder->address = '';
			$builder->address2 = '';
            $builder->organization_type = 'builders';
            $builder->save();
        }

        return 0;
    }
}
