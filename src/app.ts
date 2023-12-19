import { APIGatewayEvent, Handler } from 'aws-lambda';
import { DonationService } from './services/donationService';
import { isValidEmail, isValidName, isValidMobile, isValidDonationAmount } from './services/validations';

export const handler: Handler = async (event: APIGatewayEvent) => {
    try {
        const { email, name, mobile, donationAmount } = JSON.parse(event.body || '{}');

        if (!isValidEmail(email) || !isValidName(name) || !isValidMobile(mobile) || !isValidDonationAmount(donationAmount)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input. Please provide valid values for email, name, mobile, and donationAmount.' }),
            };
        }

        const donationService = new DonationService();

        // Record donation
        await donationService.recordDonation(email, name, mobile, donationAmount);

        // Get donation count
        const donationCount = await donationService.getDonationCount(email);

        // Return success response with donation count
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Donation processed successfully', donationCount }),
        };
    } catch (error) {
        // Return error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error processing donation' }),
        };
    }
};
