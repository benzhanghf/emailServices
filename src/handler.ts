import { APIGatewayEvent } from 'aws-lambda';
import { EmailProvider } from './services/EmailProvider';

export const emailservice = async (event: APIGatewayEvent) => {
    const provider = new EmailProvider();
    const method = event.httpMethod;
    const path = event.path;
    if (method === 'POST' && path === '/email/send') {
        try {
            const body = event.body ? JSON.parse(event.body) : null;
            if (body === null) {
                const err = {errors: ['POST body could not be empty.']};
                return { statusCode: 400, body: JSON.stringify(err)};
            }
            const resp = await provider.sendEmail(body);
            return { statusCode: 200, body: JSON.stringify(resp)};
        } catch (err) {
            // some uncatched errors
            console.log(err.errors);
            return { statusCode: 500, body: JSON.stringify(err.errors)};
        }
    } else if (method === 'GET' && path === '/email/check') {
        return { statusCode: 501, body: 'Check email send function is not implemented yet.' };
    } else {
        return { statusCode: 501, body: 'Function is not implemented yet.' };
    }
};
