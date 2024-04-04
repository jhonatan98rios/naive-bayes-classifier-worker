import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import * as dotenv from 'dotenv'

dotenv.config()

export class SQSProvider {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor() {
    this.sqsClient = new SQSClient({ region: "us-east-1" });
    this.queueUrl = process.env.NLP_QUEUE_URL!
  }

  public async sendMessage(message: string): Promise<void> {
    const command = new SendMessageCommand({ QueueUrl: this.queueUrl, MessageBody: message });
    await this.sqsClient.send(command);
  }

  public async receiveMessage(): Promise<string | undefined> {
    const command = new ReceiveMessageCommand({ 
        QueueUrl: this.queueUrl, 
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20
    })
    
    const response = await this.sqsClient.send(command);

    if (response.Messages && response.Messages.length > 0) {
      const message = response.Messages[0];

      // Delete the message from the queue after receiving
      await this.deleteMessage(message.ReceiptHandle!);

      return message.Body;
    }

    return undefined;
  }

  private async deleteMessage(receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({ QueueUrl: this.queueUrl, ReceiptHandle: receiptHandle });
    await this.sqsClient.send(command);
  }
}
