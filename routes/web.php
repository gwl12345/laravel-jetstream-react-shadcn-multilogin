<?php

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\PasskeyController;
use App\Http\Controllers\TwoFactorController;
use App\Http\Controllers\BrowserSessionController;
use App\Http\Controllers\ProfileSettingsController;
use App\Http\Controllers\MagicLinkController;
use Laragear\WebAuthn\Http\Routes as WebAuthnRoutes;
use App\Http\Controllers\WebAuthn\WebAuthnLoginController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use App\Http\Controllers\WebAuthn\WebAuthnRegisterController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Magic Link Routes
Route::post('/magic-link/send', [MagicLinkController::class, 'sendMagicLink'])
    ->middleware(['guest', 'throttle:5,1'])
    ->name('magic-link.send');

Route::get('/magic-link/login/{user}', [MagicLinkController::class, 'authenticateViaLink'])
    ->middleware(['guest', 'signed'])
    ->name('magic-link.login');

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('settings/password', function () {
        return Inertia::render('Profile/Password');
    })->name('password.edit');

    Route::get('settings/appearance', function () {
        return Inertia::render('Profile/Appearance');
    })->name('appearance');

    Route::get('settings/browser-sessions', [ProfileSettingsController::class, 'showBrowserSessions'])->name('browser-sessions');

    // Two-factor authentication route - only if feature is enabled
    if (Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm')) {
        Route::get('settings/two-factor', [ProfileSettingsController::class, 'showTwoFactor'])->name('two-factor');
    }

    Route::get('/settings/passkeys', [PasskeyController::class, 'index'])->name('passkeys.index');
    Route::post('/settings/passkeys', [PasskeyController::class, 'store'])->name('passkeys.store');
    Route::delete('/settings/passkeys/{id}', [PasskeyController::class, 'delete'])->name('passkeys.delete');
});

WebAuthnRoutes::register();
