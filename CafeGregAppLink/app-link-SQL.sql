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

CREATE TABLE Customers (
  ID NVARCHAR(9) PRIMARY KEY,         
  Contact NVARCHAR(255) NOT NULL,      
  FirstName NVARCHAR(100)             
);


CREATE TABLE tables (
  id INT PRIMARY KEY,
  link_id INT
);

Create table tables_orders (
	table_id int,
	order_id int
)


CREATE TABLE table_customers (
  table_id INT,
  customer_id NVARCHAR(9), 
  FOREIGN KEY (customer_id) REFERENCES Customers(ID)
);


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

INSERT INTO Customers (ID, Contact, FirstName)
VALUES 
  ('345538268', 'nathanmimoun2001@gmail.com', 'Nathan'),
  ('345538269', '0584020406', 'Lea'),
  ('345538270', 'david@gmail.com', N'דוד');

  INSERT INTO table_customers (table_id, customer_id)
VALUES
  (3, '345538268'),  -- Nathan to table 3
  (3, '345538269'),  -- Lea to table 3
  (4, '345538270');  -- David to table 4


CREATE PROC getOrdersWithTableId
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


CREATE PROC orderProductById
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


CREATE PROC getProductById
  @productId INT
AS
BEGIN
  SET NOCOUNT ON;

  SELECT *
  FROM products
  WHERE id = @productId;
END;


CREATE PROC getSections
AS
BEGIN
  SET NOCOUNT ON;

  SELECT * FROM sections;
END;

exec getSections

CREATE OR ALTER PROC getProductsBySectionId
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

CREATE PROC getTableIdWithLinkId
  @linkId INT
AS
BEGIN
  SET NOCOUNT ON;

  SELECT id FROM tables WHERE link_id = @linkId;
END;


alter PROC getOrdersWithTableId
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

exec getOrdersWithTableId 3

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


CREATE OR ALTER PROCEDURE cancelOrder
  @orderId INT
AS
BEGIN
  SET NOCOUNT ON;

  -- Vérifie si la commande existe
  IF NOT EXISTS (SELECT 1 FROM orders WHERE id = @orderId)
  BEGIN
    RAISERROR('Order does not exist.', 16, 1);
    RETURN;
  END

  -- Récupère le tableId lié à cette commande
  DECLARE @tableId INT;
  SELECT TOP 1 @tableId = table_id FROM tables_orders WHERE order_id = @orderId;

  -- Supprime la commande
  DELETE FROM orders WHERE id = @orderId;

  -- Supprime la liaison
  DELETE FROM tables_orders WHERE table_id = @tableId AND order_id = @orderId;
END;



CREATE OR ALTER PROCEDURE RegisterCustomer
  @id NVARCHAR(50),
  @contact NVARCHAR(255),
  @firstName NVARCHAR(100),
  @tableId INT
AS
BEGIN
  SET NOCOUNT ON;

  -- Vérifie si l'utilisateur existe déjà
  IF EXISTS (SELECT 1 FROM Customers WHERE ID = @id)
  BEGIN
    RAISERROR('User already exists.', 16, 1);
    RETURN;
  END

  -- Insère le nouvel utilisateur
  INSERT INTO Customers (ID, Contact, FirstName)
  VALUES (@id, @contact, @firstName);

  -- Vérifie si le client est déjà assigné à une table (normalement non car nouveau)
  IF EXISTS (
    SELECT 1
    FROM table_customers
    WHERE customer_id = @id
  )
  BEGIN
    RAISERROR('User is already assigned to a table.', 16, 1);
    RETURN;
  END

  -- Insère le lien client → table
  INSERT INTO table_customers (table_id, customer_id)
  VALUES (@tableId, @id);
END




CREATE OR ALTER PROCEDURE LoginCustomer
  @id NVARCHAR(50),
  @tableId INT
AS
BEGIN
  SET NOCOUNT ON;

  -- Vérifie que le client existe dans Customers
  IF NOT EXISTS (SELECT 1 FROM Customers WHERE ID = @id)
  BEGIN
    RAISERROR('User not found in Customers.', 16, 1);
    RETURN;
  END

  -- Vérifie si le client est déjà assigné à une table différente
  IF EXISTS (
    SELECT 1 
    FROM table_customers
    WHERE customer_id = @id
      AND table_id <> @tableId
  )
  BEGIN
    RAISERROR('User is already assigned to another table.', 16, 1);
    RETURN;
  END

  -- Vérifie si le client est déjà assigné à cette table (connecté)
  IF EXISTS (
    SELECT 1
    FROM table_customers
    WHERE customer_id = @id
      AND table_id = @tableId
  )
  BEGIN
    RAISERROR('User is already connected to this table.', 16, 1);
    RETURN;
  END

  -- Ajoute le client à la table
  INSERT INTO table_customers (table_id, customer_id)
  VALUES (@tableId, @id);

  -- Retourne les infos du client
  SELECT ID, Contact, FirstName
  FROM Customers
  WHERE ID = @id;
END


CREATE OR ALTER PROC GetAllCustomersByTableId
  @tableId INT
AS
BEGIN
  SET NOCOUNT ON;

  SELECT 
    c.ID AS customer_id,
    c.Contact,
    c.FirstName
  FROM table_customers tc
  JOIN Customers c ON tc.customer_id = c.ID
  WHERE tc.table_id = @tableId;
END

exec GetAllCustomersByTableId 4

CREATE OR ALTER PROCEDURE SearchProductsByName
  @searchText NVARCHAR(255)
AS
BEGIN
  SET NOCOUNT ON;

  SELECT id, name, price, img
  FROM products
  WHERE LOWER(name) LIKE '%' + LOWER(@searchText) + '%';
END;


CREATE OR ALTER PROCEDURE DisconnectCustomer
  @customerId NVARCHAR(9)
AS
BEGIN
  SET NOCOUNT ON;

  -- Vérifie si l'utilisateur est connecté (présent dans table_customers)
  IF EXISTS (SELECT 1 FROM table_customers WHERE customer_id = @customerId)
  BEGIN
    -- Supprime la ligne pour le déconnecter
    DELETE FROM table_customers WHERE customer_id = @customerId;
  END
  ELSE
  BEGIN
    RAISERROR('Customer is not connected to any table.', 16, 1);
  END
END;

select * from table_customers

exec DisconnectCustomer 33


