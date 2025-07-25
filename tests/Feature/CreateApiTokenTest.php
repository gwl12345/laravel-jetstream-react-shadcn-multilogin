<?php

use App\Models\User;
use Laravel\Jetstream\Features;

test('api tokens can be created', function () {
    if (! Features::hasApiFeatures()) {
        $this->markTestSkipped('API support is not enabled.');
    }

    $this->actingAs($user = User::factory()->withPersonalTeam()->create());

    $this->post('/user/api-tokens', [
        'name' => 'Test Token',
        'permissions' => [
            'read',
            'update',
        ],
    ]);

    expect($user->fresh()->tokens)->toHaveCount(1);
    expect($user->fresh()->tokens->first()->name)->toEqual('Test Token');
    expect($user->fresh()->tokens->first()->can('read'))->toBeTrue();
    expect($user->fresh()->tokens->first()->can('delete'))->toBeFalse();
});