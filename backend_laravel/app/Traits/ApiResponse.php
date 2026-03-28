<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Retourne une réponse de succès standardisée
     *
     * @param mixed $data
     * @param string|null $message
     * @param int $code
     * @return JsonResponse
     */
    protected function successResponse($data, string $message = null, int $code = 200): JsonResponse
    {
        return response()->json([
            'status'  => 'Success',
            'message' => $message,
            'data'    => $data
        ], $code);
    }

    /**
     * Retourne une réponse d'erreur standardisée
     *
     * @param string|null $message
     * @param int $code
     * @return JsonResponse
     */
    protected function errorResponse(string $message = null, int $code): JsonResponse
    {
        return response()->json([
            'status'  => 'Error',
            'message' => $message,
            'data'    => null
        ], $code);
    }
}
