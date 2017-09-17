DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  
  item_id INTEGER(11) NOT NULL,
  
  product_name VARCHAR(100) NOT NULL,
  
  department_name VARCHAR(75) NULL,
  
  price DECIMAL (5,2) NOT NULL,
  
  stock_quantity INTEGER(30) NULL,
  
  date_created  DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  date_modified DATETIME ON UPDATE CURRENT_TIMESTAMP,
  
   PRIMARY KEY (id)
);


select * from products;
