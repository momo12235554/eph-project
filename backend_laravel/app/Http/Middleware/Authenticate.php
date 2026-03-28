<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Pour les routes API, on retourne null (pas de redirection)
     * ce qui déclenche une réponse 401 JSON via notre handler.
     */
    protected function redirectTo(Request $request): ?string
    {
        return null;
    }
}
