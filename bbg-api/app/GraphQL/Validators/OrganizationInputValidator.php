<?php

namespace App\GraphQL\Validators;

use Nuwave\Lighthouse\Validation\Validator;

class OrganizationInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            "organization_type" => ["required","in:builders,bbg,manufacturers,distributers,suppliers"],
            "name"              => ["required","min:5","max:256","string"],
            "abbreviation"       => ["required","min:1","max:10"]
        ];
    }


    public function messages(): array
    {
        return [
            'organization_type.in' => 'The organization type is out of range or not available.',
            'name.max' => 'The organization name is too long',
        ];
    }
}
