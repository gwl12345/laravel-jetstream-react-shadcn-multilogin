<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PasskeyController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $passkeys = $user->webauthnCredentials()->get(['id', 'alias', 'created_at']);
        return Inertia::render('Profile/Passkey', [
            'passkeys' => $passkeys,
        ]);
    }

    public function delete(Request $request)
    {
        try {
            $user = auth()->user();
            if ($user->webauthnCredentials()->where('id', $request->id)->firstOrFail()->delete()) {
                return redirect()->route('passkeys.index')->with('success', 'Passkey deleted successfully!');
            }
        } catch (\Exception $e) {
            return redirect()->route('passkeys.index')->with('error', 'Failed to delete passkey.');
        }
    }
}
