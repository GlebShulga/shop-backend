create table product (
  id uuid not null PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text not null,
  description text.
  price integer
);

insert into product(title, store_id, description, price) values
('Cat`s food', '32ee2762-3e47-4fc0-a498-79d21567946f', 'Food for cat', 26),
('Dog`s food', '32ee2762-3e47-4fc0-a498-79d21567946f', 'Different food for dog', 15),
('Fish`s food', '32ee2762-3e47-4fc0-a498-79d21567946f', 'Awesome food for fish', 23)

create table stock (
  product_id uuid not null PRIMARY key,
  count integer,
  foreign key (product_id) references product(id)
)

insert into stock(product_id, count) values
('88c83b98-3372-47f6-98aa-ec20e1f98999', 236),
('874d791d-63bf-465b-a9ca-41949b01d005', 123),
('448f0f66-20be-4c7c-8375-55c4152ff246', 369)
