import { EmailProvider } from '../src/services/EmailProvider';

describe('EmailProvider', () => {
    test('config initial test', () => {
        process.env.TESTONLY = 'UNIT_TEST_ONLY';
        process.env.SENDGRID_APIKEY = '123456';
        process.env.AWS_SES_USERNAME = '54321';
        process.env.AWS_SES_PASSWORD = 'abcde';
        const provider = new EmailProvider();
        const keys = provider.getAllKeys();
        const result = {
            SendGridAPIKey: '123456',
            SESUsername: '54321',
            SESPassword: 'abcde'
        };
        expect(keys).toEqual(
            result
        );
    });
});
