import { Client } from "pg";

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

const dbOptions = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  debug: true,
  delayMs: 3000,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

class Product {
  private client: any;

  constructor() {
    this.client = new Client(dbOptions);
    this.client.connect();
  }

  async find() {
    return this.client.query(
      "select p.id, p.title, p.description, p.price, s.count from product p inner join stock s on s.product_id = p.id"
    );
  }

  async findOneBy(id) {
    return this.client.query(
      `select p.id, p.title, p.description, p.price, s.count from product p inner join stock s on s.product_id = p.id and p.id = '${id}'`
    );
  }

  end() {
    this.client.end()
  }
}

export default new Product();