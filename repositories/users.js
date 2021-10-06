const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
	async comparePasswords(saved, supplied) {
		// Saved -> password saved in our database. 'hashed.salt'
		// Supplied -> password given to us by a user trying sign in
		const [hashed, salt] = saved.split(".");
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

		return hashed === hashedSuppliedBuf.toString("hex");
	}

	async create(attrs) {
		// attrs ===  { email: '',  password:'' }
		attrs.id = this.randomId();
		//salt === '23j23g2'
		const salt = crypto.randomBytes(8).toString("hex");
		//buf === 'password23j23g2' -> 'dkjg;akjl;kdjfja;'
		const buf = await scrypt(attrs.password, salt, 64);

		const records = await this.getAll();
		const record = {
			...attrs,
			password: `${buf.toString("hex")}.${salt}`,
			//'dkjg;akjl;kdjfja;'.'23j23g2'
		};
		records.push(record);

		await this.writeAll(records);

		return record;
	}
}

module.exports = new UsersRepository("users.json");
