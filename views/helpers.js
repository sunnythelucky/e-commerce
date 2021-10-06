const { requirePasswordConfirmation } = require("../routes/admin/validators");

module.exports = {
	getError(errors, prop) {
		//prop === 'email' || 'password' || 'passwordConfirmation'
		try {
			return errors.mapped()[prop].msg;
			// errors.mapped() === {
			//   email: {
			//     msg: 'Invalid Email'
			//   },
			//   password: {
			//     msg: 'Invalid password'
			//   },
			//   requirePasswordConfirmation: {
			//     msg: 'Password must match'
			//   }
			// }
		} catch (err) {
			return "";
		}
	},
};
