<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * Ensure the logged in user has one of the specified roles.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  mixed  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!in_array($request->user()->role, $roles)) {
            return response()->json([
                'status' => 'Error',
                'message' => "Accès restreint. Cette action nécessite des privilèges : " . implode(', ', $roles) . ".",
                'code' => 403
            ], 403);
        }

        return $next($request);
    }
}
