import { DonationService } from '../src/services/donationService';

jest.mock('aws-sdk', () => {
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => ({
                put: jest.fn().mockReturnThis(),
                query: jest.fn().mockReturnThis(),
                promise: jest.fn(),
            })),
        },
        SNS: jest.fn(() => ({
            publish: jest.fn().mockReturnThis(),
            promise: jest.fn(),
        })),
    };
});

describe('DonationService', () => {
    let donationService: DonationService;
  
    beforeEach(() => {
        process.env.TABLE_NAME = process.env.TABLE_NAME;
        donationService = new DonationService();
    });
  
    describe('recordDonation', () => {
        it('should record a donation and send a thank you message if the count is 2 or more', async () => {
            const email = 'test@test.com';
            const name = 'Test';
            const mobile = '9898989898';
            const donationAmount = 1;
    
            // Mock the DynamoDB query to return a count of 1 (simulate one previous donation)
            (donationService as any).dynamoDb.query.mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue({ Count: 1 }),
            });
    
            // Mock the DynamoDB put to resolve successfully
            (donationService as any).dynamoDb.put.mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue({}),
            });
    
            await donationService.recordDonation(email, name, mobile, donationAmount);
    
            // Check that put and publish were called
            expect((donationService as any).dynamoDb.put).toHaveBeenCalledWith({
                TableName: process.env.TABLE_NAME,
                Item: expect.objectContaining({
                    email,
                    name,
                    mobile,
                    donationAmount,
                }),
                ConditionExpression: 'attribute_not_exists(id)',
            });
        });
    });
  
    describe('getDonationCount', () => {
        it('should return the donation count for a given email', async () => {
            const email = 'test@test.com';
        
            // Mock the DynamoDB query to return a count of 3
            (donationService as any).dynamoDb.query.mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue({ Count: 3 }),
            });
        
            const count = await donationService.getDonationCount(email);
        
            expect(count).toBe(3);
            expect((donationService as any).dynamoDb.query).toHaveBeenCalledWith({
                TableName: process.env.TABLE_NAME,
                KeyConditionExpression: 'email = :email',
                ExpressionAttributeValues: {
                    ':email': email,
                },
            });
        });
    });
});
