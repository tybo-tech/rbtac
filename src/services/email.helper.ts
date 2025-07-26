import { EmailBody } from './email.body';
import { EmailService } from './email.service';

export class EmailHelper {
  constructor(private emailService: EmailService) {}
  sendVerificationCodeEmail(email: string) {
    const body = EmailBody.verifyEmail();
     this.emailService.send({
      sender_name: 'Tybo Editor Support Team',
      recipient_name: email,
      recipient_email: email,
      subject: 'Verification Code | Welcome to Tybo Editor',
      message:body.text,
    }).subscribe();
    return body.verificationCode;
  }

  sendWelcomeEmail(email: string, name: string) {
    const body = EmailBody.welcomeEmail(name);
    this.emailService.send({
      sender_name: 'Tybo Editor Support Team',
      recipient_name: name,
      recipient_email: email,
      subject: 'Welcome to Tybo Editor',
      message: body,
    }).subscribe();
  }
}
