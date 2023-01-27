<?php

namespace App\Console\Commands;

use App\Models\Organizations;
use App\Models\Programs;
use Carbon\Carbon;
use Illuminate\Console\Command;
use League\Csv\CharsetConverter;
use League\Csv\Reader;

class ImportProgramSeedData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bbg:import-program-seed-data {filename}';
    //php artisan bbg:import-program-seed-data database/data/Indiv-Program-test.csv

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import the program csv data into the db';

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
        $filename = $this->argument('filename');
        if(!$filename) {
            $this->error("You must provide the filename of a CSV to import.");
            return 1;
        }

        $csv = Reader::createFromPath($filename);
        $csv->setHeaderOffset(0);
        $input_bom = $csv->getInputBOM();
        if ($input_bom === Reader::BOM_UTF16_LE
            || $input_bom === Reader::BOM_UTF16_BE) {
            CharsetConverter::addTo($csv, 'utf-16', 'utf-8');
        }
        $csv->getHeader();

        foreach ($csv->getRecords() as $record) {

            $program = new Programs();

            $program->name = $record['ProgramName'];
            $program->type = strtolower($record['ProgramType']);

            if( strtolower($record['ProgramType']) === 'volume' ){
                $program->all_builder_report_quantity = false;
            }

            if(isset($record['Start Date']) && !empty($record['Start Date'])) {
                $startDate = Carbon::createFromFormat('m/d/Y',$record['Start Date']);
            }else{
                $startDate = Carbon::createFromFormat('m/d/Y','1/1/2021');
            }
            if(isset($record['End Date\'']) && !empty($record['End Date\''])){
                $endDate = Carbon::createFromFormat('m/d/Y',$record['End Date']);
            } else {
                $endDate = Carbon::createFromFormat('m/d/Y','12/31/2021');
            }
            $program->start_date = $startDate;
            $program->end_date = $endDate;

            if (isset($record['supplierID']) && !empty($record['supplierID'])){
                $supplier = Organizations::where('id',$record['supplierID'])->first();
                if( $supplier ){
                    $program->company_id = $record['supplierID'];
                }
            }

            $program->valid_region_type = 'US And CA';
            $program->save();

            if( isset($supplier) && $supplier->supplyingProducts()->exists() ){
                $products = $supplier->supplyingProducts()->pluck('id')->toArray();

                $program->products()->attach($products);

                $program->save();
            }
        }

        return 0;
    }
}
