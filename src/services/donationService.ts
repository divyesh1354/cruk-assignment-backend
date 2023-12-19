import { DynamoDB, SNS } from 'aws-sdk';

export class DonationService {
    public dynamoDb: DynamoDB.DocumentClient;
    public donationTable: string;
    public sns: SNS;
    public snsTopicArn: string;

    constructor() {
        this.dynamoDb = new DynamoDB.DocumentClient();
        this.donationTable = process.env.TABLE_NAME!;
        this.sns = new SNS();
        this.snsTopicArn = 'arn:aws:sns:eu-west-2:390302538247:CRUK';

        if (!this.donationTable) {
            throw new Error('TABLE_NAME environment variable is not set');
        }
    }

    async recordDonation(email: string, name: string, mobile: string, donationAmount: number): Promise<void> {
        // Store donations in DynamoDB
        const id = (Math.random() + 1).toString(36).substring(2);
        await this.dynamoDb.put({
            TableName: this.donationTable,
            Item: {
                id,
                email,
                name,
                mobile,
                donationAmount,
            },  
            ConditionExpression: 'attribute_not_exists(id)', // Ensure 'id' is unique
        }).promise();

        // Check the donation count after recording the donation
        const donationCount = await this.getDonationCount(email);

        // If the user has made 2 or more donations, send a thank you message via SNS
        if (donationCount >= 2) {
            await this.sendThankYouMessage(email);
        }
    }

    async getDonationCount(email: string): Promise<number> {
        // Retrieve donation count from DynamoDB
        const response = await this.dynamoDb.query({
            TableName: this.donationTable,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email,
            },
        }).promise();

        return response.Count ?? 0;
    }

    async sendThankYouMessage(email: string): Promise<void> {
        // Send a special thank you message via SNS
        const message = `Thank you for making 2 or more donations, ${email}!`;

        await this.sns.publish({
            TopicArn: this.snsTopicArn,
            Message: message,
        }).promise();
    }
}
