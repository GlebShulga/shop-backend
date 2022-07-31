import { Client } from "pg";

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

const dbOptions = {
  host: "db-instance.c90rtrmadoet.eu-west-1.rds.amazonaws.com",
  port: 5432,
  user: "postgres",
  password: "tYPtb6lRXdMBUti6PZhp",
  database: "shop",
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

  async create(title, description, price, count) {
    const createdProduct = await this.client.query(
      `insert into product(title, description, price) values ('${title}', '${description}', ${price}) returning id`,
    );
    const productId = await createdProduct.rows[0].id
    await this.client.query(`insert into stock(product_id, count) values ('${productId}', ${count})`)

    return productId
  }

  async find() {
    return await this.client.query(
      "select p.id, p.title, p.description, p.price, s.count from product p inner join stock s on s.product_id = p.id"
    );
  }

  async findOneBy(id) {
    return await this.client.query(
      `select p.id, p.title, p.description, p.price, s.count from product p inner join stock s on s.product_id = p.id and p.id = '${id}'`
    );
  }

  end() {
    this.client.end();
  }
}

export default new Product();
