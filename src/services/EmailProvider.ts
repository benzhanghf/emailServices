import AWS from 'aws-sdk';
import axios from 'axios';

export class EmailProvider {
    public static SENDGRID_ENDPOINT: string = 'https://api.sendgrid.com/v3/mail/send';
    public static PROVIDER_SENDGRID: string = 'sendgrid';
    public static PROVIDER_AWSSES: string = 'ses';
    public static PROVIDER_MAILGUN: string = 'mailgun';

    public errMessages: any[] = [];
    public defaultFromEmail: string = 'no-reply@haifengzhang.me';

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

    public isValidEmail(email: string)
    {
        if (!email) {
            return false;
        }
        if (email.length > 254) {
            return false;
        }
        const emailTester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        const valid = emailTester.test(email);
        if (!valid) {
            return false;
        }
        // Further checking of some things regex can't handle
        const parts = email.split('@');
        if (parts[0].length > 64) {
            return false;
        }
        const domainParts = parts[1].split('.');
        if (domainParts.some((part) => part.length > 63)) {
            return false;
        }
        return true;
    }

    public validation(data)
    {
        if (!data.content) {
            this.errMessages.push('Payload missing required field: content');
            return false;
        }
        if (!data.subject) {
            this.errMessages.push('Payload missing required field: subject');
            return false;
        }
        if (!data.to || !Array.isArray(data.to)) {
            this.errMessages.push('Payload missing required field: to or it is not array');
            return false;
        } else {
            data.to.forEach((email) => {
                if (!this.isValidEmail(email)) {
                    this.errMessages.push('invalid to email: ' + email);
                }
            });
            if (this.errMessages.length > 0) {
                return false;
            }
        }
        // check cc field
        if (data.cc) {
            if (!Array.isArray(data.cc)) {
                this.errMessages.push('cc field must be array of emails');
                return false;
            }
            if (data.cc.length === 0) {
                this.errMessages.push('cc field must be array must not be empty when used');
                return false;
            }
            data.cc.forEach((email) => {
                if (!this.isValidEmail(email)) {
                    this.errMessages.push('invalid cc email: ' + email);
                }
            });
            if (this.errMessages.length > 0) {
                return false;
            }
        }
        // check bcc field
        if (data.bcc) {
            if (!Array.isArray(data.bcc)) {
                this.errMessages.push('bcc field must be array of emails');
                return false;
            }
            if (data.bcc.length === 0) {
                this.errMessages.push('bcc field must be array must not be empty when used');
                return false;
            }
            data.bcc.forEach((email) => {
                if (!this.isValidEmail(email)) {
                    this.errMessages.push('invalid bcc email: ' + email);
                }
            });
            if (this.errMessages.length > 0) {
                return false;
            }
        }
        return true;
    }

    public async sendEmail(data)
    {
        const valid = this.validation(data);
        if (!valid) {
            return this.getErrorResponse();
        }
        // for test reason to test fallback method choose which service call first
        if (data.test && data.test === EmailProvider.PROVIDER_SENDGRID) {
            // sendgrid first and ses fallback
            try {
                const resp = await this.sendBySendGrid(data);
                return resp;
            } catch (err) {
                console.log(err);
                this.errMessages.push(err.message);
            }
            try {
                const resp = await this.sendBySES(data);
                return resp;
            } catch (err) {
                console.log(err);
                this.errMessages.push(err.message);
            }
        } else {
            // ses first and sendgrid fallback
            try {
                const resp = await this.sendBySES(data);
                return resp;
            } catch (err) {
                console.log(err);
                this.errMessages.push(err.message);
            }
            try {
                const resp = await this.sendBySendGrid(data);
                return resp;
            } catch (err) {
                console.log(err);
                this.errMessages.push(err.message);
            }
        }
        return {errors: this.errMessages};
    }

    public async sendBySendGrid(data)
    {
        const postData = this.prepareSendGridData(data);
        const resp = await axios.post(
            EmailProvider.SENDGRID_ENDPOINT,
            postData,
            {
                headers: {
                    Authorization: 'Bearer ' + this.SendGridAPIKey,
                    ContentType: 'application/json'
                },
                timeout: 10000  // 10 seconds
            }
        ).then((response) => {
            return response;
        }).catch((err) => {
            throw new Error(JSON.stringify(err.response.data));
        });
        return {success: true, provider: 'SendGrid', response: resp.data, debug: this.errMessages};
    }

    public prepareSendGridData(data)
    {
        const payload: any = {};
        payload.personalizations = [];
        const contacts: any = {};
        const toEmails: any[] = [];
        data.to.forEach((toEmail) => {
            const emailObj: any = {email: toEmail};
            toEmails.push(emailObj);
        });
        contacts.to = toEmails;
        if (data.cc) {
            const ccEmails: any[] = [];
            data.cc.forEach((ccEmail) => {
                const emailObj: any = {email: ccEmail};
                ccEmails.push(emailObj);
            });
            contacts.cc = ccEmails;
        }
        if (data.bcc) {
            const bccEmails: any[] = [];
            data.bcc.forEach((bccEmail) => {
                const emailObj: any = {email: bccEmail};
                bccEmails.push(emailObj);
            });
            contacts.bcc = bccEmails;
        }
        payload.personalizations.push(contacts);
        payload.from = {};
        payload.from.email = this.defaultFromEmail;
        payload.subject = data.subject;
        payload.content = [];
        const text = {
            type: 'text/plain',
            value: data.content
        };
        payload.content.push(text);
        return payload;
    }

    public async sendBySES(data)
    {
        AWS.config.update({region: 'ap-southeast-2'});
        const params = {
            Destination: {
                ToAddresses: data.to,
                CcAddresses: data.cc,
                BccAddresses: data.bcc
            },
            Message: {
                Body: {
                    Text: {
                        Charset: 'UTF-8',
                        Data: data.content
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: data.subject
                }
            },
            Source: this.defaultFromEmail
        };
        const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
        const resp = await sendPromise.then((result) => {
            return result.MessageId;
        }).catch((err) => {
            throw new Error(err.message);
        });
        return {success: true, provider: 'AWS SES', response: resp, debug: this.errMessages};
    }

    public getErrorResponse()
    {
        return {errors: this.errMessages};
    }
}
