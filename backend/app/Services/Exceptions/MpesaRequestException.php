<?php

namespace App\Services\Exceptions;

use RuntimeException;
use Throwable;

class MpesaRequestException extends RuntimeException
{
    public function __construct(
        string $message,
        public readonly array $response = [],
        public readonly int $httpStatus = 0,
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }
}
