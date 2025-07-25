<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MagicLinkNotification extends Notification
{
    use Queueable;

    private string $magicLink;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $magicLink)
    {
        $this->magicLink = $magicLink;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $appName = config('app.name');

        return (new MailMessage)
            ->subject('Login for ' . $appName)
            ->view('emails.magic-link', [
                'magicLink' => $this->magicLink,
                'appName' => $appName,
                'userName' => $notifiable->name ?? 'there',
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'magic_link' => $this->magicLink,
        ];
    }
}
