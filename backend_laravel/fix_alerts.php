<?php App\Models\Alerte::where('type', 'expiration')->delete(); App\Models\Medicament::all()->each(function($m) { $m->touch(); });
