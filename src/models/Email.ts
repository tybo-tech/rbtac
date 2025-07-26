export interface IEmail {
  sender_name: string;
  recipient_name: string;
  recipient_email: string;
  subject: string;
  message: string;
}

export interface IEmailResponse {
  message: string;
}

export function initEmail(): IEmail {
  return {
    sender_name: '',
    recipient_name: '',
    recipient_email: '',
    subject: '',
    message: '',
  };
}
