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

  async change_user_email_notifications_state(username, state) {
    console.log(username);
    console.log(state);
    try {
      const updatedUser = await this._prisma.user.updateMany({
        where: { username: username },
        data: { get_email_notifications: state },
      });
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }

  async subscribe_user_to_notifications(
    username,
    email,
    get_email_notifications
  ) {
    try {
      const newUser = await this._prisma.user.create({
        data: {
          username: username,
          email: email,
          get_email_notifications: get_email_notifications,
        },
      });
      return newUser;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  DB,
};
