export default class UsersController {
  constructor(userService) {
    this.userService = userService;
  }

  requestPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;

      const result = await this.userService.sendRecoveryEmail(email);

      res.send({ status: "success", payload: result });

    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      const result = await this.userService.resetPassword(token, newPassword);

      res.send({ status: "success", payload: result });

    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  };
}