const { PrismaClient } = require("@prisma/client");

class DB {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async get_all_notifications_by_username(username) {
    try {
      const notifications = await this._prisma.notification.findMany({
        where: {
          user: {
            username: username,
          },
        },
      });
      return notifications;
    } catch (error) {
      throw new Error(`Error retrieving notifications: ${error}`);
    }
  }
}

module.exports = {
  DB,
};
