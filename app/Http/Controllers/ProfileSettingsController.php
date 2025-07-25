<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Laravel\Jetstream\Agent;
use Laravel\Fortify\Features;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Laravel\Jetstream\Http\Controllers\Inertia\Concerns\ConfirmsTwoFactorAuthentication;

/**
 * Overwriting default jetstream controller function for two factor authentication and browser sessions.
 *
 */
class ProfileSettingsController extends Controller
{
    use ConfirmsTwoFactorAuthentication;

    /**
     * Show the browser sessions settings screen.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function showBrowserSessions(Request $request)
    {
        return Inertia::render('Profile/BrowserSession', [
            'sessions' => $this->sessions($request)->all()
        ]);
    }

    /**
     * Get the current sessions.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Support\Collection
     */
    protected function sessions(Request $request)
    {
        if (config('session.driver') !== 'database') {
            return collect();
        }

        return collect(
            DB::connection(config('session.connection'))->table(config('session.table', 'sessions'))
                    ->where('user_id', $request->user()->getAuthIdentifier())
                    ->orderBy('last_activity', 'desc')
                    ->get()
        )->map(function ($session) use ($request) {
            $agent = $this->createAgent($session);

            return (object) [
                'agent' => [
                    'is_desktop' => $agent->isDesktop(),
                    'platform' => $agent->platform(),
                    'browser' => $agent->browser(),
                ],
                'ip_address' => $session->ip_address,
                'is_current_device' => $session->id === $request->session()->getId(),
                'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
            ];
        });
    }

    /**
     * Create a new agent instance from the given session.
     *
     * @param  mixed  $session
     * @return \Laravel\Jetstream\Agent
     */
    protected function createAgent($session)
    {
        return tap(new Agent(), fn ($agent) => $agent->setUserAgent($session->user_agent));
    }

    /**
     * Show the two-factor authentication settings page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function showTwoFactor(Request $request)
    {
        $this->validateTwoFactorAuthenticationState($request);

        return Inertia::render('Profile/TwoFactorAuthenticationForm', [
            'requiresConfirmation' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
        ]);
    }
}
