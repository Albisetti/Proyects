<?php

namespace App\Http\Controllers;

use App\Models\Claims;
use League\Csv\Writer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

use App\Helpers\ClaimReporting;
use App\Models\Organizations;
use App\Models\OrganizationDues;
use App\Models\Programs;
use App\Models\Products;
use App\Models\Houses;
use App\Models\RebateReports;
use App\Models\claimsRebateReports;

class UtilityController extends Controller {
    public static function generateFactoryClaimsSpreadsheet() {
//        $guard = Auth::guard(config('sanctum.web'));
//        $user = $guard->user();
//
//        if(!$user || $user->type != 'admin') {
//            throw new Exception('Nonexistent or non-admin user trying to access factory claims spreadsheet.');
//        }

        $numberFormatter = new \NumberFormatter('en_US', \NumberFormatter::CURRENCY);

        $csv = Writer::createFromFileObject(new \SplTempFileObject());

        /* Header row: define columns */
        $csv->insertOne([
            'Builder',
            'Subdivision',
            'Address',
            'CO Date',
            'Product Serial Number',
            'Product Model Number',
            'Product Brand',
            'Date of Purchase',
            'Date of Installation',
            'Qty',
            'Product Rebate Value'
        ]);

        $claimRebateReports = claimsRebateReports::all()
            ->load(['claim', 'rebateReport']);

        foreach($claimRebateReports as $claimRebateReport) {
            $report = RebateReports::find($claimRebateReport->rebateReport->rebateReport_id);
            $organization = Organizations::find($report->organization_id);
            $house = Houses::find($claimRebateReport->rebateReport->house_id);
            $product = Products::find($claimRebateReport->rebateReport->product_id);

            if(!$organization || !$house || !$product) {
                continue;
            }

            $property_type = $house->property_type;
            $rebate_value = 0;

            switch($property_type) {
                case 'residential':
                    $rebate_value = $product->residential_rebate_amount;
                    break;
                case 'commercial':
                    $rebate_value = $product->commercial_rebate_amount;
                    break;
                case 'multi-unit':
                    $rebate_value = $product->multi_unit_rebate_amount;
                    break;
            }

            $csv->insertOne([
                $organization->name,
                (isset($house->subdivision)?$house->subdivision->name:'').
                $house->address,
                $house->confirmed_occupancy,

                $claimRebateReport->rebateReport->product_serial_number,
                $claimRebateReport->rebateReport->product_model_number,
                $claimRebateReport->rebateReport->product_brand,
                $claimRebateReport->rebateReport->product_date_of_purchase,
                $claimRebateReport->rebateReport->product_date_of_installation,

                $claimRebateReport->rebateReport->product_quantity,
                $numberFormatter->format($claimRebateReport->rebateReport->product_quantity * $rebate_value)
            ]);
        }

        return $csv->getContent();


//        return response($csv->getContent())
//            ->withHeaders([
//                'Content-Type' => 'text/csv'
//            ]);
    }

    public static function generateAllocationSpreadsheet( $reportYear = null, $reportQuarter = null ) {
//        $guard = Auth::guard(config('sanctum.web'));
//        $user = $guard->user();
//
//        if(!$user || $user->type != 'admin') {
//            throw new Exception('Nonexistent or non-admin user trying to access allocations spreadsheet.');
//        }

        $numberFormatter = new \NumberFormatter('en_US', \NumberFormatter::CURRENCY);

        $claimRebateReports = claimsRebateReports::whereNotNull('approved_at')
            ->whereHas('claim',function ($query)use($reportYear,$reportQuarter){
                if( isset($reportYear) ) {
                    $query->where('report_year',$reportYear);
                }

                if( isset($reportQuarter) ) {
                    $query->where('report_quarter',$reportQuarter);
                }
            })
            ->get()->load(['claim', 'rebateReport']);

        $claimIDs = $claimRebateReports->pluck('claim.id')->unique();

        $csv = Writer::createFromFileObject(new \SplTempFileObject());
        $csv->insertOne([
            'Builder',
            'Program',
            'Program Type',
            'Program Rebate Total',
            'Dues Payment',
            'Builder Total'
        ]);

        foreach($claimRebateReports as $claimRebateReport) {
            $report = RebateReports::find($claimRebateReport->rebateReport->rebateReport_id);
            $organization = Organizations::find($report->organization_id);
            $program = Programs::find($claimRebateReport->claim->program_id);

            $claim_sum_unfiltered = ClaimReporting::SumClaims(['ready to close','close'], //get program total
                $reportYear,
                $reportQuarter,
                null,
                [$program->id],
                null,
                null,
                null);
            $claim_sum_builder = ClaimReporting::SumClaims(['ready to close','close'], //get program-builder total
                $reportYear,
                $reportQuarter,
                [$organization->id],
                [$program->id],
                null,
                null,
                null);
            $total = $program->type === "factory" ? $claim_sum_unfiltered["factoryTotal"] : $claim_sum_unfiltered["volumeTotal"];
            $builder_total = $program->type === "factory" ? $claim_sum_builder["factoryTotal"] : $claim_sum_builder["volumeTotal"];
            $thisYearDue = $organization->annualDue($reportYear);
            $dues_payment = (isset($thisYearDue)?
                (isset($thisYearDue->prorated_amount)?$thisYearDue->prorated_amount:$thisYearDue->annual_dues)
                :0);

            $csv->insertOne([
                $organization->name,
                $program->name,
                $program->type,
                $numberFormatter->format($total),
                $numberFormatter->format($dues_payment),
                $numberFormatter->format($builder_total)
            ]);
        }

        return $csv->getContent();

//        return response($csv->getContent())
//            ->withHeaders([
//                'Content-Type' => 'text/csv'
//            ]);
    }

    public function index(Request $request) {
        return response()->json(true);
    }
}
