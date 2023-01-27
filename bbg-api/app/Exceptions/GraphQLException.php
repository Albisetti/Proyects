<?php

namespace App\Exceptions;

use Exception;
use GraphQL\Error\ClientAware;

class GraphQLException extends Exception implements ClientAware
{
    /**
     * @var @string
     */
    private $reason;

    /**
     * CustomException constructor.
     *
     * @param  string  $message
     * @param  string  $reason
     * @return void
     */
    public function __construct(string $message, string $reason)
    {
        parent::__construct($message, 201);

        $this->reason = $reason;
    }

    /**
     * Returns true when exception message is safe to be displayed to a client.
     *
     * @api
     * @return bool
     */
    public function isClientSafe(): bool
    {
        return true;
    }

    /**
     * Returns string describing a category of the error.
     *
     * Value "graphql" is reserved for errors produced by query parsing or validation, do not use it.
     *
     * @api
     * @return string
     */
    public function getCategory(): string
    {
        return 'API';
    }

    /**
     * Return the content that is put in the "extensions" part
     * of the returned error.
     *
     * @return array
     */
    public function extensionsContent(): array
    {
        return [
            'some' => 'additional information',
            'reason' => $this->reason,
        ];
    }
}
