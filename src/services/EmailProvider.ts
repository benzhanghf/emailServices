// import axios from 'axios';

export class EmailProvider {
    public static PROVIDER_SENDGRID: string = 'sendgrid';
    public static PROVIDER_AWSSES: string = 'ses';
    public static PROVIDER_MAILGUN: string = 'mailgun';

    private SendGridAPIKey?: string;
    private SESUsername?: string;
    private SESPassword?: string;

    constructor() {
        this.SendGridAPIKey = process.env.SENDGRID_APIKEY;
        this.SESUsername = process.env.AWS_SES_USERNAME;
        this.SESPassword = process.env.AWS_SES_PASSWORD;
    }

    // this function is used for testing private keys
    public getAllKeys() {
        if (process.env.TESTONLY === 'UNIT_TEST_ONLY') {
            return {
                SendGridAPIKey: this.SendGridAPIKey,
                SESUsername: this.SESUsername,
                SESPassword: this.SESPassword
            };
        } else {
            return {};
        }
    }

    public async sendEmail(
        toEmail: string,
        cc: any[],
        bcc: any[],
        subject?: string,
        message?: string
    ) {
        if (message === null || message === 'undefined') {
            // provide default message like datetime to make it unique
            message = 'No user input messages.';
            message += ' Adding some dynamic content like server time: ' + new Date().toUTCString();
        }
        if (subject === null || subject === 'undefined') {
            // provide default message like datetime to make it unique
            subject = 'It is Demo Test Email';
        }
        const fromEmail = 'no-reply@somedomain.com';
    }
}
