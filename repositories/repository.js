const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
	constructor(filename) {
		if (!filename) {
			throw new Error("Creating a repository requires a filename");
		}

		this.filename = filename;
		try {
			//to check the file exist or not.
			fs.accessSync(this.filename);
			//if it doen't, we will create a file.
		} catch (err) {
			fs.writeFileSync(this.filename, "[]");
		}
	}
	// attrs: {password: "232423", email: "sunny@gmail.com"}
	async create(attrs) {
		attrs.id = this.randomId();
		//big list of exsiting users
		const records = await this.getAll();
		//push new user
		records.push(attrs);
		//write the updated 'records' array back to this.filename
		await this.writeAll(records);

		return attrs;
	}

	async getAll() {
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: "utf8",
			})
		);
	}

	async writeAll(records) {
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2)
		);
	}

	randomId() {
		return crypto.randomBytes(4).toString("hex");
	}

	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}

	async delete(id) {
		const records = await this.getAll();
		const filteredRecords = records.filter((record) => record.id !== id);
		await this.writeAll(filteredRecords);
	}

	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);

		if (!record) {
			throw new Error(`Record with id ${id} not found`);
		}
		//record === { email : 'test@test.co'}
		//attrs === { password : 'password'}
		Object.assign(record, attrs);
		//record = {  email: 'text@test.com', password: 'password'  }
		await this.writeAll(records);
	}

	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records) {
			let found = true;

			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}

			if (found) {
				return record;
			}
		}
	}
};
