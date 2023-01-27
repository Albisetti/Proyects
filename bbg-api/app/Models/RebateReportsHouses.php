<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class RebateReportsHouses extends Pivot
{
//    use HasFactory;

    protected $table = 'rebateReports_houses';

    public $incrementing = true;

    protected $fillable = [
        'rebateReport_id',
        'house_id',
        'status'
    ];

    public function products(): BelongsToMany
    {
        return $this
            ->belongsToMany(Products::class, 'rebateReports_products', 'rebateReport_house_id', 'product_id')
            ->using(RebateReportsProducts::class)
            ->withPivot(
                'quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'distributor_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    //TODO: will need modification once on the 3 way Pivot
    public function readyForClaim(){

        $require_certificate_occupancy = false;
        $require_subcontractor_provider = false;
        $require_brand = false;
        $require_serial_number = false;
        $require_model_number = false;
        $require_date_of_installation = false;
        $require_date_of_purchase = false;
        $require_installer_pointer = false;
        $require_installer_company = false;
        $require_distributor = false;

        $house = Houses::find($this->house_id);
        $products = $this->products()->get();

        //Determine what proofpoint are needed
        foreach ($products as $product){
            $programs = $product->programs()->get();

            if(
                !$require_certificate_occupancy
//                || !$require_subcontractor_provider
                || !$require_brand
                || !$require_serial_number
                || !$require_model_number
                || !$require_date_of_installation
                || !$require_date_of_purchase
//                || !$require_installer_pointer
//                || !$require_installer_company
                || !$require_distributor
            ){
                foreach ($programs as $program){
                    if(!$require_certificate_occupancy && $program->require_certificate_occupancy) $require_certificate_occupancy = $program->require_certificate_occupancy;
//                    if(!$require_subcontractor_provider && $program->require_subcontractor_provider) $require_subcontractor_provider = $program->require_subcontractor_provider;
                    if(!$require_brand && $program->require_brand) $require_brand = $program->require_brand;
                    if(!$require_serial_number && $program->require_serial_number) $require_serial_number = $program->require_serial_number;
                    if(!$require_model_number && $program->require_model_number) $require_model_number = $program->require_model_number;
                    if(!$require_date_of_installation && $program->require_date_of_installation) $require_date_of_installation = $program->require_date_of_installation;
                    if(!$require_date_of_purchase && $program->require_date_of_purchase) $require_date_of_purchase = $program->require_date_of_purchase;
//                    if(!$require_installer_pointer && $program->require_installer_pointer) $require_installer_pointer = $program->require_installer_pointer;
//                    if(!$require_installer_company && $program->require_installer_company) $require_installer_company = $program->require_installer_company;
                    if(!$require_distributor && $program->require_distributor) $require_distributor = $program->require_distributor;
                }
            } else {
                break; //All proof establish as needed no need to continue looping
            }

//        throw new \Exception(json_encode($require_certificate_occupancy));
//        throw new \Exception(json_encode($require_subcontractor_provider));
//        throw new \Exception(json_encode($require_brand));
//        throw new \Exception(json_encode($require_serial_number));
//        throw new \Exception(json_encode($require_model_number));
//        throw new \Exception(json_encode($require_date_of_installation));
//        throw new \Exception(json_encode($require_date_of_purchase));
//        throw new \Exception(json_encode($require_installer_pointer));
//        throw new \Exception(json_encode($require_installer_company));
//        throw new \Exception(json_encode($require_distributor));

//        throw new \Exception(json_encode($house->confirmed_occupancy));
//        throw new \Exception(json_encode($product->pivot));
//            throw new \Exception(json_encode($product->pivot->brand));
//            throw new \Exception(json_encode($product->pivot->serial_number));
//            throw new \Exception(json_encode($product->pivot->model_number));
//            throw new \Exception(json_encode($product->pivot->date_of_installation));
//            throw new \Exception(json_encode($product->pivot->date_of_purchase));
//            throw new \Exception(json_encode($product->pivot->installer_pointer));
//            throw new \Exception(json_encode($product->pivot->installer_company));
//            throw new \Exception(json_encode($product->pivot->distributor_id));

            if( $require_certificate_occupancy && (!isset($house->confirmed_occupancy) || empty($house->confirmed_occupancy) ) ) return false;
//        if( $require_subcontractor_provider && (!isset($product->pivot->subcontractor_provider) || empty($product->pivot->subcontractor_provider) ) ) return false;
            if( $require_brand && (!isset($product->pivot->brand) || empty($product->pivot->brand) ) ) return false;
            if( $require_serial_number && (!isset($product->pivot->serial_number) || empty($product->pivot->serial_number) ) ) return false;
            if( $require_model_number && (!isset($product->pivot->model_number) || empty($product->pivot->model_number) ) ) return false;
            if( $require_date_of_installation && (!isset($product->pivot->date_of_installation) || empty($product->pivot->date_of_installation) ) ) return false;
            if( $require_date_of_purchase && (!isset($product->pivot->date_of_purchase) || empty($product->pivot->date_of_purchase) ) ) return false;
//            if( $require_installer_pointer && (!isset($product->pivot->installer_pointer) || empty($product->pivot->installer_pointer) ) ) return false;
//            if( $require_installer_company && (!isset($product->pivot->installer_company) || empty($product->pivot->installer_company) ) ) return false;
            if( $require_distributor && (!isset($product->pivot->distributor_id) || empty($product->pivot->distributor_id) ) ) return false;
        }

        //At this point, all needed proof points have been confirmed as filled
        return true;
    }
}
