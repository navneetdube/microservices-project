const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log("🐰 RabbitMQ connected (User Service)");
}

function getChannel() {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
