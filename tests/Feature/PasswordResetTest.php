<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;
use Laravel\Fortify\Features;

test('reset password link screen can be rendered', function () {
    if (! Features::enabled(Features::resetPasswords())) {
        $this->markTestSkipped('Password updates are not enabled.');
    }

    $response = $this->get('/forgot-password');

    $response->assertStatus(200);
});

test('reset password link can be requested', function () {
    if (! Features::enabled(Features::resetPasswords())) {
        $this->markTestSkipped('Password updates are not enabled.');
    }

    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', [
        'email' => $user->email,
    ]);

    Notification::assertSentTo($user, ResetPassword::class);
});

test('reset password screen can be rendered', function () {
    if (! Features::enabled(Features::resetPasswords())) {
        $this->markTestSkipped('Password updates are not enabled.');
    }

    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', [
        'email' => $user->email,
    ]);

    Notification::assertSentTo($user, ResetPassword::class, function (object $notification) {
        $response = $this->get('/reset-password/'.$notification->token);

        $response->assertStatus(200);

        return true;
    });
});

test('password can be reset with valid token', function () {
    if (! Features::enabled(Features::resetPasswords())) {
        $this->markTestSkipped('Password updates are not enabled.');
    }

    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', [
        'email' => $user->email,
    ]);

    Notification::assertSentTo($user, ResetPassword::class, function (object $notification) use ($user) {
        $response = $this->post('/reset-password', [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasNoErrors();

        return true;
    });
});