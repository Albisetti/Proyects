<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ClaimPeriodCloseNotification extends Notification
{
    use Queueable;

    public $quarter;
    public $year;

    private $from;
    private $subject;
    private $contentBody;
    private $isHtml;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($quarter,$year)
    {
        //
        $this->quarter    = $quarter;
        $this->year    = $year;
        $this->from    = config('constants.admin_email_recipient', 'no-reply@buildersbuyersgroup.com');
        $this->subject = 'BBG - The ' . $year . ' Q' . $quarter . ' has been closed.';
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
            ->view('emails.ClaimPeriodCloseNotificationMessage',
                [
                    'year' => $this->year,
                    'quarter' => $this->quarter,
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
