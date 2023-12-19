import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';


export class RecruitmentNodejsTestStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // DynamoDB table for donations
        const donationsTable = new dynamodb.Table(this, 'DonationsTable', {
            partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        process.env.TABLE_NAME = donationsTable.tableName;

        // Create Lambda function
        const donationFunction = new lambda.Function(this, 'DonationFunction', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'app.handler',
            code: lambda.Code.fromAsset('src'),
            environment: {
                TABLE_NAME: donationsTable.tableName,
            },
        });

        const api = new apigateway.RestApi(this, 'DonationsApi', {
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
            },
        });

        const donationsResource = api.root.addResource('donations');
        const donateIntegration = new apigateway.LambdaIntegration(donationFunction);
        donationsResource.addMethod('POST', donateIntegration);

        donationsTable.grantFullAccess(donationFunction);
    }
}
