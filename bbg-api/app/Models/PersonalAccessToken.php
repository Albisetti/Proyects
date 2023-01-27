<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
	public function impersonator(): BelongsTo {
		return $this->belongsTo(PersonalAccessToken::class, 'parent_token_id');
	}
}