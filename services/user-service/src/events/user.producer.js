const { getChannel } = require("../config/rabbitmq");

const QUEUE = "user.created";

async function publishUserCreatedEvent(user) {
  const channel = getChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  channel.sendToQueue(
    QUEUE,
    Buffer.from(JSON.stringify(user)),
    { persistent: true }
  );

  console.log("📤 UserCreated event published:", user.id);
}

module.exports = { publishUserCreatedEvent };
