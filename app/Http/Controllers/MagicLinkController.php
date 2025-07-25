<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use App\Notifications\MagicLinkNotification;
use Illuminate\Http\RedirectResponse;

class MagicLinkController extends Controller
{
    /**
     * Send a magic link to the user's email
     */
    public function sendMagicLink(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $email = $request->email;

        // Rate limiting
        $key = 'magic-link:' . $email;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'email' => "Too many attempts. Please try again in {$seconds} seconds."
            ]);
        }

        RateLimiter::hit($key, 300); // 5 minutes

        // Check if user exists
        $user = User::where('email', $email)->first();

        // Generate temporary signed URL
        $magicLink = URL::temporarySignedRoute(
            'magic-link.login',
            now()->addMinutes(15),
            ['user' => $user->id, 'hash' => sha1($user->email)]
        );

        // Send email
        $user->notify(new MagicLinkNotification($magicLink));

        return back();
    }

    /**
     * Authenticate user via magic link
     */
    public function authenticateViaLink(Request $request, User $user): RedirectResponse
    {
        // Verify the signature
        if (!$request->hasValidSignature()) {
            abort(401, 'Invalid or expired magic link.');
        }

        // Verify the hash matches the user's email
        if (!hash_equals(sha1($user->email), $request->get('hash'))) {
            abort(401, 'Invalid magic link.');
        }

        // Log the user in
        Auth::login($user, true); // true for remember me

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }


}
