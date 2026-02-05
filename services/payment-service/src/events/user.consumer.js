const { getChannel } = require("../config/rabbitmq");

const QUEUE = "user.created";

async function consumeUserCreatedEvent() {
  const channel = getChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  channel.consume(QUEUE, async (msg) => {
    if (msg) {
      const user = JSON.parse(msg.content.toString());

      console.log("📥 UserCreated event received:", user);

      // 👉 Here you can:
      // - create payment profile
      // - initialize wallet
      // - setup subscription

      channel.ack(msg);
    }
  });

  console.log("👂 Waiting for UserCreated events...");
}

module.exports = { consumeUserCreatedEvent };
