create database bamazon_db;
USE bamazonDB;
CREATE TABLE products (
id int(11) NOT NULL AUTO_INCREMENT,
products_name varchar(30) NOT NULL,
department_id int(11) NOT NULL,
price decimal(10,2) NOT NULL,
stock_quantity int(11) NOT NULL,
primary key (id),
key department_id (department_id)
)ENGINE=InnoDB auto_increment=20 default char set=utf8;
insert into products values(1,'microphoneXLR' ,1,69.95,25),(2,'microphoneQtr',5,6.79,63),
(3,'microphoneset' ,5,40.30,80),(4,'DirectBoxXlr',3,40.00,10),(5,'noisefilter',3,39.95,5),
(6,'monsterCordsoft' ,2,70.50,12),(7,'noiseFilter', 3,39.95,5),
(8,'minimixer-4',4,99.50,10),(9,'mixer6channel',4,149.50,4),
(10,'mixerwireless',4,259.50,5);
select * from products;
