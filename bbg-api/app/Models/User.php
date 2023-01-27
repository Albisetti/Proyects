<?php

namespace App\Models;

use App\Helpers\ClaimReporting;
use App\Notifications\UserInvite;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Lab404\Impersonate\Models\Impersonate;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens,
        HasFactory,
        Impersonate,
        InteractsWithMedia,
        Notifiable,
        Searchable,
        SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'title',
        'role_id',
        'first_name',
        'last_name'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function fullName(){

        $name = '';

        if(isset($this->first_name) && !empty($this->first_name)) $name .= $this->first_name;
        if(
            isset($this->first_name) && !empty($this->first_name) &&
            isset($this->last_name) && !empty($this->last_name)
        ) $name .= ' ';
        if(isset($this->last_name) && !empty($this->last_name)) $name .= $this->last_name;

        return $name;
    }

    /**
     * Return this user's image, if one exists.
     *
     * @return string
     */
    public function userImage(): ?string {
        $image = Media::where('model_type', '=', "App\Models\User")
            ->where('model_id', '=', $this->id)
            ->first();
        if(!$image) {
            return null;
        }

        return $image->file_name;
    }

    /**
     * Get's this user attributes
     *
     * @return HasOne
     */
    public function role() {
        return $this->belongsTo(Role::class);
    }

    public function userAttribute(): HasOne
    {
        return $this->hasOne(UserAttribute::class, 'user_id', 'id');
    }

    public function managedOrganizations(): BelongsToMany
    {
        return $this
            ->belongsToMany(Organizations::class, 'organizations_territoryManagers', 'user_id','organization_id')
            ->using(builders_territoryManagers::class)
            ;
    }

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organizations::class, 'organizations_users', 'user_id','organization_id');
    }

    public function state(): HasOne
    {
        return $this->hasOne(State::class, 'id', 'state_id');
    }

    public function managedStates(): BelongsToMany
    {
        return $this->belongsToMany(State::class, 'user_state_assignments', 'user_id', 'state_id');
    }

    /**
     * @return bool
     */
    public function canImpersonate()
    {
        return ($this->type === 'admin' || $this->type === 'admin' ? 1 : 0);
    }

    public function managedOrganizationsActionRequiredRebatesCount(){
        $builders = $this->managedOrganizations()->get();
        if(!$builders) return [
            'rebateCount'=>0,
            'subdivisionCount'=>0
        ];

        $rebateCount=0;
        $subdivisionCount=0;

        foreach ($builders as $builder){

            $rebates = RebateReportsHousesProducts::where('status','action required')->whereHas('rebateReports',function($query)use($builder){
                $query->where('organization_id',$builder->id);
            })->get()->unique('house_id');
            $rebateCount += $rebates->count();
            $subdivision = SubDivision::countSubdivisionsOfRebates($rebates);
            $subdivisionCount += $subdivision['subdivisionCount'];
        }

        return [
            'rebateCount'=>$rebateCount,
            'subdivisionCount'=>$subdivisionCount
        ];
    }

    public function managedOrganizationsReadiedRebatesCount(){
        $builders = $this->managedOrganizations()->get();
        if(!$builders) return [
            'rebateCount'=>0,
            'subdivisionCount'=>0
        ];

        $rebateCount=0;
        $subdivisionCount=0;

        foreach ($builders as $builder){

            $rebates = RebateReportsHousesProducts::where('status','rebate ready')->whereHas('rebateReports',function($query)use($builder){
                $query->where('organization_id',$builder->id);
            })->get()->unique('house_id');
            $rebateCount += $rebates->count();
            $subdivision = SubDivision::countSubdivisionsOfRebates($rebates);
            $subdivisionCount += $subdivision['subdivisionCount'];
        }

        return [
            'rebateCount'=>$rebateCount,
            'subdivisionCount'=>$subdivisionCount
        ];
    }

    public function projectedRevenue(){
        switch ($this->type){
            case 'builders':
            default:
                $builders = [$this->organizations()->first()];
            break;
            case 'territory_managers':
                $projectedTotal = 0;
                $programs = collect([]);
                $combinationUsed = collect([]);
                $conversionsAllocation = collect([]);

                $AllPrograms = Programs::get(); //Needed to return to graphql, it won't accepts programs from $rebate
                $rebates = DB::select("
SELECT
    `programs`.id,
    `organizations_territoryManagers`.organization_id,

    `claim_rebateReport`.rebateReport_id as factory_id,
    `claim_rebateReport`.total_allocation as factory_total_allocation,
    `claim_rebateReport`.builder_allocation as factory_builder_allocation

FROM
    `organizations_territoryManagers`
    left join (
        select `claim_rebateReport`.*, `rebateReports`.organization_id
        FROM `claim_rebateReport`
        left join `rebateReports_houses_products` on `claim_rebateReport`.rebateReport_id = rebateReports_houses_products.id
        left join `rebateReports` on rebateReports_houses_products.rebateReport_id = rebateReports.id
    ) as `claim_rebateReport` on `organizations_territoryManagers`.organization_id = `claim_rebateReport`.organization_id
    left join (
        select `programs`.*, `claims`.id as claim_id, `claims`.claim_type as claim_type
        from `programs`
        left join `claims` on programs.id = claims.program_id
    ) as programs on `claim_rebateReport`.claim_id = `programs`.claim_id
where claim_type = 'factory' and `organizations_territoryManagers`.user_id = ?;
                ",[$this->id]);

                foreach ($rebates as $rebate){
                    if ( isset($rebate->factory_total_allocation) && isset($rebate->factory_builder_allocation) ){
                        $previousMatchingRebate = $combinationUsed->where('factory_id',$rebate->factory_id)->where('organization_id',$rebate->organization_id);

                        if($previousMatchingRebate->isEmpty()){
                            $program = $AllPrograms->where('id',$rebate->id)->first();
                            $total_allocation = (isset($rebate->factory_total_allocation) ? $rebate->factory_total_allocation : 0);
                            $builder_allocation = (isset($rebate->factory_builder_allocation) ? $rebate->factory_builder_allocation : 0);
                            $bbgAllocation = $total_allocation - $builder_allocation;

                            $projectedTotal += $bbgAllocation;

                            $programsIndex = $programs->search(function ($item, $key)use($program){
                                return $item->id == $program->id;
                            });
                            if ( $programsIndex !== false  ){
                                $programs[$programsIndex]['contributedTotal'] += $bbgAllocation;

                            } else {
                                $program->contributedTotal = $bbgAllocation;
                                $programs->push($program);
                            }
                        }
                    }

                    if ( isset($rebate->volume_total_allocation) && isset($rebate->volume_builder_allocation) ){
                        $previousMatchingRebate = $combinationUsed->where('volume_id',$rebate->volume_id)->where('organization_id',$rebate->organization_id);

                        if($previousMatchingRebate->isEmpty()){
                            $program = $AllPrograms->where('id',$rebate->id)->first();
                            $total_allocation = (isset($rebate->volume_total_allocation) ? $rebate->volume_total_allocation : 0);
                            $builder_allocation = (isset($rebate->volume_builder_allocation) ? $rebate->volume_builder_allocation : 0);
                            $bbgAllocation = $total_allocation - $builder_allocation;

                            $projectedTotal += $bbgAllocation;

                            $programsIndex = $programs->search(function ($item, $key)use($program){
                                return $item->id == $program->id;
                            });
                            if ( $programsIndex !== false  ){
                                $programs[$programsIndex]['contributedTotal'] += $bbgAllocation;

                            } else {
                                $program->contributedTotal = $bbgAllocation;
                                $programs->push($program);
                            }
                        }
                    }
                }

                $volumeRebates = DB::select("
SELECT
    `programs`.id,
    `organizations_territoryManagers`.organization_id,

    `volumeClaims_builders`.id as volume_id,
    `volumeClaims_builders`.total_allocation as volume_total_allocation,
    `volumeClaims_builders`.builder_allocation as volume_builder_allocation

FROM
    `organizations_territoryManagers`
        left join `volumeClaims_builders` on volumeClaims_builders.builder_id = `organizations_territoryManagers`.organization_id
        left join (
        select `programs`.*, `claims`.id as claim_id
        from `programs`
                 left join `claims` on programs.id = claims.program_id
    ) as programs on `volumeClaims_builders`.volumeClaim_id = `programs`.claim_id
where `organizations_territoryManagers`.user_id = ?;
                ",[$this->id]);

                foreach ($volumeRebates as $rebate){

                    if ( isset($rebate->volume_total_allocation) && isset($rebate->volume_builder_allocation) ){
                        $previousMatchingRebate = $combinationUsed->where('volume_id',$rebate->volume_id)->where('organization_id',$rebate->organization_id);

                        if($previousMatchingRebate->isEmpty()){
                            $program = $AllPrograms->where('id',$rebate->id)->first();
                            $total_allocation = (isset($rebate->volume_total_allocation) ? $rebate->volume_total_allocation : 0);
                            $builder_allocation = (isset($rebate->volume_builder_allocation) ? $rebate->volume_builder_allocation : 0);
                            $bbgAllocation = $total_allocation - $builder_allocation;

                            $projectedTotal += $bbgAllocation;

                            $programsIndex = $programs->search(function ($item, $key)use($program){
                                return $item->id == $program->id;
                            });
                            if ( $programsIndex !== false  ){
                                $programs[$programsIndex]['contributedTotal'] += $bbgAllocation;

                            } else {
                                $program->contributedTotal = $bbgAllocation;
                                $programs->push($program);
                            }
                        }
                    }
                }

                $usedProgramIds = $programs->pluck('id');
                $conversions = ConversionFlatPayment::
                whereHas('program', function ($query) use ($usedProgramIds) {
                    $query->whereIn('programs.id', $usedProgramIds->all());
                })
                    ->get();
                foreach ($conversions as $conversion){
                    $projectedTotal += $conversion->amount;
                    $conversionsAllocation->push($conversion);
                }
                $conversionsAllocation = $conversionsAllocation->unique('id');

                return [
                    'projectedTotal'=>round($projectedTotal,2),
                    'programs'=>$programs->map(function ($item,$key){
                        $item->contributedTotal = round($item->contributedTotal,2);
                        return $item;
                    }),
                    'conversions'=>(isset($conversionsAllocation)?$conversionsAllocation:null)
                ];

                break;
            case 'admin':
                $projectedTotal = 0;
                $programs = collect([]);
                $conversionsAllocation = collect([]);

                $rebates = RebateReportsHousesProducts::whereHas('claims',function ($query){
                    $query->where('claim_type','factory');
                })->with('claims','claims.program')->get();
                foreach ($rebates as $rebate){
                    if ( isset($rebate->claims) ){
                        foreach ($rebate->claims as $rebateClaim){
                            $program = $rebateClaim->program;
                            $total_allocation = (isset($rebateClaim->pivot->total_allocation) ? $rebateClaim->pivot->total_allocation : 0);
                            $builder_allocation = (isset($rebateClaim->pivot->builder_allocation) ? $rebateClaim->pivot->builder_allocation : 0);
                            $bbgAllocation = $total_allocation - $builder_allocation;

                            $projectedTotal += $bbgAllocation;

                            $programsIndex = $programs->search(function ($item, $key)use($program){
                                return $item->id == $program->id;
                            });
                            if ( $programsIndex !== false  ){
                                $programs[$programsIndex]['contributedTotal'] += $bbgAllocation;

                            } else {
                                $program->contributedTotal = $bbgAllocation;
                                $programs->push($program);
                            }
                        }
                    }
                }

                $volumeRebates = VolumeClaimsBuilders::with('claim','claim.program')->get();
                foreach ($volumeRebates as $volumeRebate){
                    $program = $volumeRebate->claim->program;
                    $total_allocation = (isset($volumeRebate->total_allocation) ? $volumeRebate->total_allocation : 0);
                    $builder_allocation = (isset($volumeRebate->builder_allocation) ? $volumeRebate->builder_allocation : 0);
                    $bbgAllocation = $total_allocation - $builder_allocation;

                    $projectedTotal += $bbgAllocation;

                    $programsIndex = $programs->search(function ($item, $key)use($program){
                        return $item->id == $program->id;
                    });
                    if ( $programsIndex !== false  ){
                        $programs[$programsIndex]['contributedTotal'] += $bbgAllocation;

                    } else {
                        $program->contributedTotal = $bbgAllocation;
                        $programs->push($program);
                    }
                }

                $usedProgramIds = $programs->pluck('id');
                $conversions = ConversionFlatPayment::
                    whereHas('program', function ($query) use ($usedProgramIds) {
                            $query->whereIn('programs.id', $usedProgramIds->all());
                        })
                ->get();
                foreach ($conversions as $conversion){
                    $projectedTotal += $conversion->amount;
                    $conversionsAllocation->push($conversion);
                }
                $conversionsAllocation = $conversionsAllocation->unique('id');

                return [
                    'projectedTotal'=>round($projectedTotal,2),
                    'programs'=>$programs->map(function ($item,$key){
                        $item->contributedTotal = round($item->contributedTotal,2);
                        return $item;
                    }),
                    'conversions'=>(isset($conversionsAllocation)?$conversionsAllocation:null)
                ];
            break;
        }

        if( empty($builders) ){
            return [
                'projectedTotal'=>0,
                'programs'=>[],
                'conversions'=>[]
            ];
        }

        //The following should only really happen on builder, which have a singular ORG.
        $projectedTotal = 0;
        $programs = collect([]);
        $conversionsAllocation = collect([]);

        foreach ( $builders as $builder ){
            if( !isset($builder) || empty($builder) ) continue;

            $projectedRevenue = $builder->projectedRevenue();
            $projectedTotal += $projectedRevenue['projectedTotal']; //if not builder causes overlap
            $conversionsAllocation = $conversionsAllocation->merge($projectedRevenue['conversions']);

            foreach ( $projectedRevenue['programs'] as $program ){
                $programsIndex = $programs->search(function ($item, $key)use($program){
                    return $item->id == $program->id;
                });
                if ( $programsIndex !== false  ){
                    $programs[$programsIndex]['contributedTotal'] += (isset($program->contributedTotal)?$program->contributedTotal:0);

                } else {
                    $programs->push($program);
                }
            }
        }

        $programs=$programs->unique('id');
        $conversionsAllocation=$conversionsAllocation->unique('id');

        return [
            'projectedTotal'=>round($projectedTotal,2),
            'programs'=>$programs->map(function ($item,$key){
                $item->contributedTotal = round($item->contributedTotal,2);
                return $item;
            }),
            'conversions'=>$conversionsAllocation
        ];
    }


    public function topBuilders($top)
    {

        if ( $this->type !== 'territory_managers' ) return null;
        $territory_manager = $this;

        $now = Carbon::now();

        $managedBuilders = $territory_manager->managedOrganizations()->get();

        $builders = $managedBuilders->sort(function ($a, $b){
            $builderATotal = $a->calculateYearRangeClaimTotal(2);
            $builderBTotal = $b->calculateYearRangeClaimTotal(2);

            return (isset($builderBTotal)?$builderBTotal:null) <=> (isset($builderATotal)?$builderATotal:null);
        });

        if( isset($top)){
            return collect($builders)->take($top);
        } else {
            return collect($builders);
        }
    }

    public function openClaimsSum( Int $year=null, Int $quarter=null, $builderIds=null, $programIds=null, $ProductIds=null, $regionIds=null, $territoryManagerIds=null )
    {
        $territoryManager = $this;

        $claims = Claims::
            where(function ($query)use($territoryManager){
                $query->whereHas('rebateReports',function ($query)use($territoryManager){
                    $query->whereHas('rebateReports',function ($query)use($territoryManager){
                        $query->whereHas('organization',function ($query)use($territoryManager){
                            $query->whereHas('territoryManagers',function ($query)use($territoryManager){
                                $query->where('users.id',$territoryManager->id);
                            });
                        });
                    });
                });
            })
            ->orWhere(function ($query)use($territoryManager){
                $query->whereHas('volumeClaimsBuilderRebates',function ($query)use($territoryManager){ //organizations
                    $query->whereHas('territoryManagers',function ($query)use($territoryManager){
                        $query->where('users.id',$territoryManager->id);
                    });
                });
            })
        ;

        $openClaimQuery = ClaimReporting::SumClaimsList(
            $claims,
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
        $territoryManager = $this;

        $claims = Claims::
        where(function ($query)use($territoryManager){
            $query->whereHas('rebateReports',function ($query)use($territoryManager){
                $query->whereHas('rebateReports',function ($query)use($territoryManager){
                    $query->whereHas('organization',function ($query)use($territoryManager){
                        $query->whereHas('territoryManagers',function ($query)use($territoryManager){
                            $query->where('users.id',$territoryManager->id);
                        });
                    });
                });
            });
        })
            ->orWhere(function ($query)use($territoryManager){
                $query->whereHas('volumeClaimsBuilderRebates',function ($query)use($territoryManager){ //organizations
                    $query->whereHas('territoryManagers',function ($query)use($territoryManager){
                        $query->where('users.id',$territoryManager->id);
                    });
                });
            })
        ;

        $lastCloseClaim = ClaimReporting::getLastCloseClaim(
            $claims,
            ['ready to close','close'],
            null,
            null,
            ( isset($builderIds) ? $builderIds : null ),
            ( isset($programIds) ? $programIds : null ),
            ( isset($ProductIds) ? $ProductIds : null ),
            ( isset($regionIds) ? $regionIds : null ),
            ( isset($territoryManagerIds) ? $territoryManagerIds : null ) );

        return $lastCloseClaim;
    }

    public function toSearchableArray()
    {
        //php artisan scout:flush "App\Models\User" && php artisan scout:import "App\Models\User"

        $array = $this->toArray();

        if($this->organizations()->exists()) {
            $array['organization_id'] = $this->organizations()->first()->id;
        } else {
            $array['organization_id'] = false;
        }
        if($this->managedOrganizations()->exists()) {
            $array['managedOrganizations'] = $this->managedOrganizations()->pluck('organizations.id')->toArray();
        }else{
            $array['managedOrganizations'] = [];
        }

        return $array;
    }

    public function save(array $options = [])
    {
        $existingUser = $this->exists;

        $results = parent::save($options);

        if(!$existingUser && (!isset($options['invitingUser']) || $options['invitingUser'] === false)){
            $this->refresh();

            $this->remember_token = Str::random(25);
            $this->notify(new UserInvite($this, $this->remember_token));
            $this->save(['invitingUser'=>true]);
        }

        return $results;
    }
}
