<?php

namespace App\Models;

use App\Events\ProgramCreated;
use App\Helpers\ClaimReporting;
use App\Helpers\WordPressHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Programs extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $fillable = [
        "id",
        "type",
        "name",
        "internal_description",
        "builder_description_short",
        "builder_description",
        "organization_id",
        "external_link",
        "required_proof_points",
        "program_rule_id",
        "address_id",
        "program_unit",
        "min_threshold",
        "global_product_minimum_unit",
        "global_product_rebate_amount_type",
        "global_product_residential_rebate_amount",
        "global_product_multi_unit_rebate_amount",
        "global_product_commercial_rebate_amount",
        "created_at",
        "updated_at",
        "archived_at",
        "valid_region_type",
        "product_minimum_unit_requirement",
        "require_certificate_occupancy",
        "require_subcontractor_provider",
        "require_brand",
        "require_serial_number",
        "require_model_number",
        "require_date_of_installation",
        "require_date_of_purchase",
        "require_installer_pointer",
        "require_installer_company",
        "require_distributor",
        "volume_bbg_rebate",
        "company_id",
        "start_date",
        "end_date"
    ];

    protected $casts = [
        "required_proof_points" => "array"
    ];

    protected static function boot() {
        parent::boot();
        static::addGlobalScope('order', function ($program) {
            $program
                ->orderBy('name')
            ;
        });
    }

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organizations::class, 'programs_organizations', 'program_id','organization_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo( Organizations::class, 'company_id' );
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Organizations::class, 'programs_participants', 'program_id','organization_id')
            ->using(ProgramParticipants::class)
            ->withPivot(
                'overwrite_amount_type',
                'residential_rebate_overwrite',
                'multi_unit_rebate_overwrite',
                'commercial_rebate_overwrite',
                'volume_bbg_rebate',
                'flat_builder_overwrite',
                'flat_bbg_overwrite',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
        ;
    }

    public function possibleRegionParticipants()
    {
        $builders = Organizations::where('organization_type','builders');

        switch($this->valid_region_type) {
            case 'US And CA':
                //Available everywhere
                $builders->whereHas('approved_states', function($query){
                    $query->whereIn('country', ['US','CA']);
                });
            break;
            case 'US':
                $builders->whereHas('approved_states', function($query){
                    $query->where('country', 'US');
                });
            break;
            case 'CA':
                $builders->whereHas('approved_states', function($query){
                    $query->where('country', 'CA');
                });
            break;
            case 'Custom':
            default:
                $valid_regions = $this->regions()->pluck('iso_code')->toArray();

                $builders->whereHas('approved_states', function($query)use($valid_regions){
                    $query->whereIn('iso_code', $valid_regions);
                });
            break;
        }

        return $builders->get();
    }

    public function possibleRegionTerritoryManagers()
    {
        $territoryManagers = User::where('type','territory_managers');

        switch($this->valid_region_type) {
            case 'US And CA':
                //Available everywhere
                $territoryManagers->whereHas('managedStates', function($query){
                    $query->whereIn('country', ['US','CA']);
                });
                break;
            case 'US':
                $territoryManagers->whereHas('managedStates', function($query){
                    $query->where('country', 'US');
                });
                break;
            case 'CA':
                $territoryManagers->whereHas('managedStates', function($query){
                    $query->where('country', 'CA');
                });
                break;
            case 'Custom':
            default:
                $valid_regions = $this->regions()->pluck('iso_code')->toArray();

                $territoryManagers->whereHas('managedStates', function($query)use($valid_regions){
                    $query->whereIn('iso_code', $valid_regions);
                });
                break;
        }

        return $territoryManagers->get();
    }

    public function address() : HasOne
    {
        return $this->hasOne(Addresses::class, "id", "address_id");
    }

    public function products() : BelongsToMany
    {
        //return $this->hasMany(Products::class, "program_id","id");
        return $this->belongsToMany(Products::class, "products_programs","program_id","product_id")
            ->using(ProductsPrograms::class)
            ->withPivot(
//                'rebate_amount_type',
//                'residential_rebate_amount',
//                'multi_unit_rebate_amount',
//                'commercial_rebate_amount',
                'multi_reporting',
                'volume_bbg_rebate',
                'created_at',
                'updated_at'
            );
    }

    public function productsForOrganization($root, $args, $context, $resolveInfo) : BelongsToMany
    {

        //TODO: use token instead of relying on FE to pass organization_id

        //return $root->hasMany(Products::class, "program_id","id");
        return $root->belongsToMany(Products::class, "products_programs","program_id","product_id")
            ->using(ProductsPrograms::class)
            ->withPivot(
//                'rebate_amount_type',
//                'residential_rebate_amount',
//                'multi_unit_rebate_amount',
//                'commercial_rebate_amount',
                'multi_reporting',
                'volume_bbg_rebate',
                'created_at',
                'updated_at'
            )
            ->where(function ($query)use($args){
                $query
                ->where('products.customization_id','=',$args['organization_id'])
                ->orWhereNull('products.customization_id');
            })
            ;
    }

    public function organizationCustomProducts(): BelongsToMany
    {
        return $this->belongsToMany(Products::class,'organization_customProducts', 'program_id', 'product_id')
            ->whereNotNull('customization_id')
            ->using(OrganizationCustomProduct::class)
            ->withPivot(
                'id',
                'organization_id',//mapping or additionnal where needed to identify correct program
                'overwrite_amount_type',
                'residential_rebate_overwrite',
                'multi_unit_rebate_overwrite',
                'commercial_rebate_overwrite',
                'volume_bbg_rebate',
                'flat_builder_overwrite',
                'flat_bbg_overwrite',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function allClaimTemplateProducts($root, $args, $context, $resolveInfo) //Lighthouse paginated passed arguments by itself, $root is the current item
    {
        $programId = $root->id;

        if ( $root->type === 'volume' ){
            $query = Products::whereHas('programs', function ($query) use ($programId){
                $query->where('products_programs.program_id',$programId)->whereNotNull('products_programs.volume_bbg_rebate');
            })->orWhereHas('organizationOverwrites', function ($query) use ($programId){ //organizationOverwrites really is just custom Products
                $query->where('organization_customProducts.program_id',$programId)->whereNotNull('organization_customProducts.volume_bbg_rebate');
            });
        } else {
            $query = Products::whereHas('programs', function ($query) use ($programId){
                $query->where('products_programs.program_id',$programId);
            })->orWhereHas('organizationOverwrites', function ($query) use ($programId){ //organizationOverwrites really is just custom Products
                $query->where('organization_customProducts.program_id',$programId);
            });
        }

        return $query;
    }

    public function regions(): BelongsToMany
    {
        return $this->belongsToMany(State::class, "programs_states","program_id","state_id")
            ->using(ProgramsStates::class)
            ;
    }

    public function getProofPointsAttribute()
    {
        return RequiredProofPoints::query()->select('*')->selectSub(function ($query) {
            $query->selectRaw('1');
            //$query->whereRaw("JSON_CONTAINS(id, '[3]' )")->get();
        }, 'active')->get();
    }

    public function programsFiles(): HasMany
    {
        return $this->hasMany(ProgramFiles::class,"program_id");
    }

    public function delete()
    {
        //On delete detach it's relation, compare to DB cascade with would delete everything (cascade) or keep the pivot record (set null)
        //down side is that we cannot return said relation in the graphql
        $this->products()->detach();
        $this->organizations()->detach();
        $this->regions()->detach();

        return parent::delete();
    }

    public function conversionFlatPayment(): HasMany
    {
        return $this->hasMany(ConversionFlatPayment::class,"program_id");
    }

    public function conversionFlatPercent(): HasMany
    {
        return $this->hasMany(ConversionFlatPercent::class,"program_id");
    }

    public function conversionTieredPercent(): HasMany
    {
        return $this->hasMany(ConversionTieredPercent::class,"program_id");
    }

    public function conversionByActivity(): HasMany
    {
        return $this->hasMany(ConversionByActivity::class,"program_id");
    }

    public function claims(): HasMany
    {
        return $this->hasMany(Claims::class, 'program_id', 'id');
    }

    public function openClaimsSum( Int $year=null, Int $quarter=null, $builderIds=null, $programIds=null, $ProductIds=null, $regionIds=null, $territoryManagerIds=null )
    {
        $openClaimQuery = ClaimReporting::SumClaimsList(
            $this->claims(),
            ['open','ready','submitted','disputed'],
            null,
            null,
            ( isset($builderIds) ? $builderIds : null ),
            ( isset($programIds) ? $programIds : null ),
            ( isset($ProductIds) ? $ProductIds : null ),
            ( isset($regionIds) ? $regionIds : null ),
            ( isset($territoryManagerIds) ? $territoryManagerIds : null ) );

        return [
//            'volumeTotal'=>$openClaimQuery['volumeTotal'],
//            'factoryTotal'=>$openClaimQuery['factoryTotal']
            'volumeTotal'=>0,
            'factoryTotal'=>0
        ];
    }

    public function lastCloseClaim( Int $year=null, Int $quarter=null, $builderIds=null, $programIds=null, $ProductIds=null, $regionIds=null, $territoryManagerIds=null )
    {

        $lastOpenClaim = ClaimReporting::getLastCloseClaim(
            $this->claims(),
            ['ready to close','close'],
            null,
            null,
            ( isset($builderIds) ? $builderIds : null ),
            ( isset($programIds) ? $programIds : null ),
            ( isset($ProductIds) ? $ProductIds : null ),
            ( isset($regionIds) ? $regionIds : null ),
            ( isset($territoryManagerIds) ? $territoryManagerIds : null ) );

        return $lastOpenClaim;
    }

    public function toSearchableArray()
    {
        //php artisan scout:flush "App\Models\Programs" && php artisan scout:import "App\Models\Programs"

        $array = $this->toArray();

        $array['iso_codes'] = $this->regions()->pluck('iso_code')->toArray();

        $array['claimable'] = (
            (
                $this->type === 'volume' && isset($this->volume_bbg_rebate)
                ||
                $this->type === 'factory'
            )
                ? true : false
        );

        if($this->participants()->exists()) $array['active_participants'] = $this->participants()->pluck('organizations.id')->toArray();

        return $array;
    }

    public function save(array $options = [])
    {

        $minimumQtyChanged = ($this->isDirty('product_minimum_unit_requirement') ||  $this->isDirty('global_product_minimum_unit'));
        $qtyReportChanged = $this->isDirty('all_builder_report_quantity');

        if ($this->exists) {
            $newProgram = false;
        } else {
            $newProgram = true;
        }

        $results = parent::save($options);
        $this->refresh();
        $program = $this;

        if ( !$newProgram  && $program->type == 'factory' && ($minimumQtyChanged || $qtyReportChanged) ) {
            $products = $program->products()->get();
            $customProducts = $program->organizationCustomProducts()->get();

            foreach ( $products as $product ){
                //Even if a product belongs to multiple program, this doesn't matter (since 1 factory and 1 volume possible and volume doesn't use these fields)

                if( $qtyReportChanged ){
                    $product->require_quantity_reporting = $program->all_builder_report_quantity;
                }

                if( $minimumQtyChanged ){
                    switch ($program->product_minimum_unit_requirement){
                        case 'No':
                            $product->minimum_unit = null;
                            break;
                        case 'Same For All':
                            $product->minimum_unit = $program->global_product_minimum_unit;
                            break;
                        case 'Custom':
                            //Don't do anything
                            break;
                    }
                }

                $product->save();

                $rebatesHouseProduct = $product->rebateHouseProduct()->where('status','!=','completed')->get();
                foreach ( $rebatesHouseProduct as $rebateHouseProduct ) {
                    if(
                    $rebateHouseProduct->claims()->whereIn('status',['submitted','disputed','ready to close','close'])->exists()
                    ) {
                        //throw new \Exception('House ' . $rebateHouseProduct->house_id . ' and product ' . $rebateHouseProduct->product_id . ' cannot be modified.');
                    } else {
                        $claim = $rebateHouseProduct->claims()->whereIn('status',['open','ready'])->first(); //A house-product combination can only be claimed once
                        if ( $claim ) {
                            if ($claim->status == 'ready') $claim->status = 'open';
                            $rebateHouseProduct->claims()->detach();
                            if ( $claim->claim_type == 'volume' ){
                                $rebateReports = $rebateHouseProduct->rebateReports()->first();
                                if($rebateReports){
                                    $org_id = $rebateReports->organization_id;
                                    $claim->volumeClaimsBuilderRebates()->where('organizations.id',$org_id)->detach();
                                }
                            }
                        }

                        if ( $rebateHouseProduct->status=='rebate ready' ){
                            if($rebateHouseProduct->readyForClaim()){
                                $rebateHouseProduct->status='rebate ready';
                            } else {
                                $rebateHouseProduct->status='action required';
                            }
                        }

                        $rebateHouseProduct->save();
                    }
                }
            }
        }

        if($newProgram) {
            event( new ProgramCreated($this));
            $wordPressToken = WordPressHelpers::login();

            if($wordPressToken !== false) {
                try {
                    $wordPressProgramTitle = WordPressHelpers::createProgram($program,$wordPressToken);
                }
                catch(\Exception $ex) {
                    //todo
                }
            }
        }

        return $results;
    }
}
