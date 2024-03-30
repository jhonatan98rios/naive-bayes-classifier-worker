import * as dotenv from 'dotenv'
import { Consumer } from 'sqs-consumer';
import ClasssifierController from './controllers';
import Database from './infra/database/connection';

dotenv.config()
Database.connect()

const classsifierController = new ClasssifierController()

const app = Consumer.create({
    queueUrl: process.env.QUEUE_URL!,
    region: process.env.AWS_REGION!,
    handleMessage: classsifierController.handle
});

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

app.on('timeout_error', (err) => {
    console.error(err.message);
});

app.start();
console.log("Working!")
console.log("Start consuming!")

