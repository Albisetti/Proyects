<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ForgottenPasswordNotification extends Notification
{
    use Queueable;

    public $user;
    private $newPassword;

    private $from;
    private $subject;
    private $contentBody;
    private $isHtml;
	public $forAnother;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user, $newPassword, $forAnother = false)
    {
        $this->user    = $user;
        $this->newPassword    = $newPassword;
        $this->from    = config('constants.admin_email_recipient', 'no-reply@buildersbuyersgroup.com');
        $this->subject = 'BBG - '. $forAnother ? 'Update Your Password' : 'Forgotten Password';
        $this->isHtml  = true;
		$this->forAnother = $forAnother;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject($this->subject)
            ->from($this->from)
            ->view(
				'emails.forgottenPassword',
                [
                    'user' => $this->user,
                    'newPassword' => $this->newPassword,
                    'webURL' => env('WEB_URL')
                ]);
    }

    /*
     * * store the notification record in database as well
     */
    public function toDatabase($notifiable) {
    }
}
