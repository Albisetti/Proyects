<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProgramCreatedNotification extends Notification
{
    use Queueable;

    public $program;

    private $from;
    private $subject;
    private $contentBody;
    private $isHtml;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($program)
    {
        //
        $this->program    = $program;
        $this->from    = config('constants.admin_email_recipient', 'no-reply@buildersbuyersgroup.com');
        $this->subject = 'BBG - a new program is now available for your region';
        $this->isHtml  = true;
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
            ->view('emails.ProgramCreatedNotification',
                [
                    'program' => $this->program,
                    'user' => $notifiable
                ])
            ;
    }

    /*
     * * store the notification record in database as well
     */
    public function toDatabase($notifiable) {
        //TODO: correct

//        return new DatabaseMessage([
//            'from' => $this->from,
//            'subject' => $this->subject,
//            'contentBody' => $this->contentBody,
//        ]);
    }
}
