import { Client } from "pg";

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

const dbOptions = {
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  user: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
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

  async create(title, description, price) {
    return await this.client.query(
        `insert into product(title, description, price) values ('${title}', '${description}', ${price})`
      );
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
    this.client.end();
  }
}

export default new Product();
