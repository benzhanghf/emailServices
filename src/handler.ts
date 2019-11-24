import { APIGatewayEvent } from 'aws-lambda';
import { EmailProvider } from './services/EmailProvider';

export const emailservice = async (event: APIGatewayEvent) => {
    const provider = new EmailProvider();
    const method = event.httpMethod;
    const path = event.path;
    const keys = provider.getAllKeys();
    const resp = {
        httpMethod: method,
        requestPath: path,
        APIKeys: keys
    };
    return { statusCode: 200, body: JSON.stringify(resp) };
};
