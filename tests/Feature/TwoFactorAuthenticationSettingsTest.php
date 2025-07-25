<?php

use App\Models\User;
use Laravel\Fortify\Features;

test('two factor authentication can be enabled', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two factor authentication is not enabled.');
    }

    $this->actingAs($user = User::factory()->create());

    $this->withSession(['auth.password_confirmed_at' => time()]);

    $this->post('/user/two-factor-authentication');

    expect($user->fresh()->two_factor_secret)->not->toBeNull();
    expect($user->fresh()->recoveryCodes())->toHaveCount(8);
});

test('recovery codes can be regenerated', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two factor authentication is not enabled.');
    }

    $this->actingAs($user = User::factory()->create());

    $this->withSession(['auth.password_confirmed_at' => time()]);

    $this->post('/user/two-factor-authentication');
    $this->post('/user/two-factor-recovery-codes');

    $user = $user->fresh();

    $this->post('/user/two-factor-recovery-codes');

    expect($user->recoveryCodes())->toHaveCount(8);
    expect(array_diff($user->recoveryCodes(), $user->fresh()->recoveryCodes()))->toHaveCount(8);
});

test('two factor authentication can be disabled', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two factor authentication is not enabled.');
    }

    $this->actingAs($user = User::factory()->create());

    $this->withSession(['auth.password_confirmed_at' => time()]);

    $this->post('/user/two-factor-authentication');

    expect($user->fresh()->two_factor_secret)->not->toBeNull();

    $this->delete('/user/two-factor-authentication');

    expect($user->fresh()->two_factor_secret)->toBeNull();
});