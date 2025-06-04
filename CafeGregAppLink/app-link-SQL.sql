create database appLinkAppCafeGreg
go
/*
USE master;
GO

ALTER DATABASE appLinkAppCafeGreg
SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO

DROP DATABASE appLinkAppCafeGreg;
GO

*/
use appLinkAppCafeGreg
go

CREATE TABLE tables (
  id INT PRIMARY KEY,
  link_id INT
);

Create table tables_orders (
	table_id int,
	order_id int
)

CREATE TABLE orders (
  id INT PRIMARY KEY,
  product_id INT,
  status_id INT
);

CREATE TABLE status (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  backgroundColor VARCHAR(50),
  color VARCHAR(50)
);

CREATE TABLE sections (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  img TEXT
);

CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10,2),
  img TEXT
);

CREATE TABLE section_products (
  section_id INT,
  product_id INT,
  PRIMARY KEY (section_id, product_id)
);

INSERT INTO tables (id, link_id) VALUES (3, 1234), (4, 1235);

INSERT INTO orders (id, product_id, status_id) VALUES 
(0, 0, 1),
(1, 3, 0),
(2, 1, 1);

INSERT INTO tables_orders(table_id, order_id) VALUES 
(3, 0),
(3, 1),
(4, 2);


INSERT INTO status (id, name, backgroundColor, color) VALUES 
(0, 'Pending', 'red', 'white'),
(1, 'Ordered', 'green', 'white');

INSERT INTO sections (id, name, img) VALUES 
(0, 'Starters', 'https://images.immediate.co.uk/production/volatile/sites/30/2021/03/French-fries-b9e3e0c.jpg'),
(1, 'Meals', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/mealprep-pasta-merged_web3_copy-6087bd8.jpg?quality=90&resize=500,454'),
(2, 'Desserts', 'https://www.foodandwine.com/thmb/ckc6L6xKox0WfpfO6dMkuVGPQOY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Angel-Food-Cake-with-Three-Berry-Compote-FT-RECIPE0323-541a780b871441e0ab14383ee38acc44.jpg');

INSERT INTO products (id, name, price, img) VALUES 
(0, 'Bruschetta', 7.50, 'https://www.simplyorganic.com/media/recipe/resized/520x520/wysiwyg/tmp/simply-oragnic-Roasted-Tomato-Bruschetta-1080x1080-thumbnail.jpg'),
(1, 'Greek Salad', 6.00, 'https://www.onceuponachef.com/images/2023/06/greek-salad-1-1200x1477.jpg'),
(2, 'Garlic Bread', 5.00, 'https://www.ambitiouskitchen.com/wp-content/uploads/2023/02/Garlic-Bread-4.jpg'),
(3, 'Spaghetti Bolognese', 12.50, 'https://img.taste.com.au/5qlr1PkR/taste/2016/11/spaghetti-bolognese-106560-1.jpeg'),
(4, 'Grilled Chicken Pasta', 13.00, 'https://foodal.com/wp-content/uploads/2020/04/Bright-Light-and-Lemony-30-Minute-Pasta-with-Grilled-Chicken.jpg'),
(5, 'Chocolate Brownie', 6.00, 'https://tutti-dolci.com/wp-content/uploads/2024/04/Triple-Chocolate-Brownies-3.jpg'),
(6, 'Strawberry Cheesecake', 6.50, 'https://sugarspunrun.com/wp-content/uploads/2023/06/Strawberry-cheesecake-recipe-6-of-8.jpg');

INSERT INTO section_products (section_id, product_id) VALUES 
(0, 0), (0, 1), (0, 2),
(1, 3), (1, 4),
(2, 5), (2, 6);


CREATE or alter PROCEDURE getOrdersWithTableId
  @table_id INT
AS
BEGIN
  SELECT 
    o.id AS order_id,
    p.name AS product_name,
    p.price,
    s.name AS status_name,
    s.backgroundColor,
    s.color
  FROM orders o
  INNER JOIN tables_orders to2 ON o.id = to2.order_id
  INNER JOIN products p ON o.product_id = p.id
  INNER JOIN status s ON o.status_id = s.id
  WHERE to2.table_id = @table_id
END

exec getOrdersWithTableId 3


CREATE PROCEDURE orderProductById
  @productId INT,
  @tableId INT
AS
BEGIN
  SET NOCOUNT ON;

  -- Créer une nouvelle commande avec un nouvel ID auto-incrémenté
  DECLARE @newOrderId INT;

  -- On récupère le max id + 1 pour créer un nouvel id (si tu n'as pas d'auto-increment)
  SELECT @newOrderId = ISNULL(MAX(id), -1) + 1 FROM orders;

  -- Insérer la nouvelle commande dans la table orders (status 0 par défaut)
  INSERT INTO orders (id, product_id, status_id)
  VALUES (@newOrderId, @productId, 0);

  -- Associer la commande à la table dans tables_orders
  INSERT INTO tables_orders (table_id, order_id)
  VALUES (@tableId, @newOrderId);
END;


CREATE PROCEDURE getProductById
  @productId INT
AS
BEGIN
  SET NOCOUNT ON;

  SELECT *
  FROM products
  WHERE id = @productId;
END;


CREATE PROCEDURE getSections
AS
BEGIN
  SET NOCOUNT ON;

  SELECT * FROM sections;
END;

exec getSections

CREATE OR ALTER PROCEDURE getProductsBySectionId
    @section_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.id, 
        p.name, 
        p.price, 
        p.img
    FROM products p
    INNER JOIN section_products sp ON p.id = sp.product_id
    WHERE sp.section_id = @section_id
END
go


exec getProductsBySectionId 0

CREATE PROCEDURE getTableIdWithLinkId
  @linkId INT
AS
BEGIN
  SET NOCOUNT ON;

  SELECT id FROM tables WHERE link_id = @linkId;
END;

CREATE or alter PROCEDURE getOrdersWithTableId
  @tableId INT
AS
BEGIN
  SET NOCOUNT ON;

  SELECT 
    o.id AS order_id,
    s.id AS status_id,
    s.name AS status_name,
    s.backgroundColor,
    s.color,
    p.id AS product_id,
    p.name AS product_name,
    p.price,
    p.img
  FROM tables_orders t_o
  JOIN orders o ON t_o.order_id = o.id
  JOIN status s ON o.status_id = s.id
  JOIN products p ON o.product_id = p.id
  WHERE t_o.table_id = @tableId;
END;



CREATE PROCEDURE changeOrderStatus
  @orderId INT,
  @newStatus INT
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE orders
  SET status_id = @newStatus
  WHERE id = @orderId;

  -- Optionnel: retourner le nouveau status
  SELECT status_id FROM orders WHERE id = @orderId;
END;


CREATE PROCEDURE cancelOrder
  @orderId INT,
  @tableId INT
AS
BEGIN
  SET NOCOUNT ON;

  -- Supprimer la commande dans la table orders
  DELETE FROM orders WHERE id = @orderId;

  -- Supprimer la liaison entre la table et la commande
  DELETE FROM tables_orders 
  WHERE table_id = @tableId AND order_id = @orderId;
END;

