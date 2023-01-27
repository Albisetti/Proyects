<?php

namespace App\Console\Commands;

use App\Helpers\WordPressHelpers;
use App\Models\Programs;
use Illuminate\Console\Command;

class ExportProgramsToWordpress extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bbg:export-programs-to-wordpress';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export all current programs in the DB into associated wordpress';

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
        $wordPressToken = WordPressHelpers::login();

        if($wordPressToken !== false) {

            $programs = Programs::whereNull('deleted_at')->get();
//            $programs = Programs::all();

            foreach ( $programs as $program ){

                try {
                    $wordPressProgramTitle = WordPressHelpers::createProgram($program,$wordPressToken);
                    $this->info("Exported Program id " . $program->id . " into wordpress as " . $wordPressProgramTitle);
                }
                catch(\Exception $ex) {
                    $this->error("Fail Exporting Program id " . $program->id . " into wordpress");
                }
            }

            $this->info("Finish Exporting Programs into Wordpress");
        }else{
            $this->error("Unable to Authenticate to wordpress");
        }
        return 0;
    }
}
