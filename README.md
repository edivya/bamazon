# bamazon
Bamazon is an Amazon-like store-front that allows users to view items in different categories and 'purchase' items. The user is able to see items available for purchase, as well as price. The 'manager" of Bamazon has the ability to view products for sale, view low inventory products, add to inventory, and add new products. Both the user's and the manager's actions automatically update the pre-existing database in MySQL.

## Computer Installations ##
To use Bamazon, MySQL must first be installed. If it has not been installed, please visit the MySql Download Page.. Additionally, the Bamazon requires the following npm's: 
 * MySQL (npm install mysql )
 * Cli-Color (npm install cli-color)
 * inquirer (npm install inquirer) and 
 * cli-table (npm install cli-table).

## Developer's Toolkit ##
Bamazon was created through:
* node.js
* mysql
* javascript

## Application Flow for Customers ##
Once the proper npms and MySQL is installed, Bamazon is easy to use! After typing node bamazon.js Inquirer will prompt the user to choose a Department category. After a department is chosen, the user will see all items for sale and choose the desired item based on Item ID. If the desired amount is in stock, Bamazon will charge the customer (see first image). If the desired amount is not in stock, Bamazon will inform the customer of how many items are available (see second image) 
## Screenshots

![customer](https://github.com/edivya/bamazon/blob/master/images/customer.jpg)

## Application Flow for Managers. ##
After typing node bamazonManager.js into the prompt, managers are able to control the MySQL database through the following commands:
1.View Products for Sale: If the manager chooses this, they will be shown every product offered through Bamazon, along with price and inventory available. (See below for example)
2.View Low Inventory: This option shows the manager which products have less than 5 items in inventory.
3.Add New Inventory: When the manager decided to add new inventory, Bamazon first offers every product name and how many are available. The managers are then able to decide which product to add inventory.
4.Add New Products: The manager is able to add a completely new product, as well as the category, amount, and set-price. 
## Screenshots

![manager](https://github.com/edivya/bamazon/blob/master/images/manager.jpg)

## Application Flow for Supervisors. ##
After typing node bamazonSupervisor.js into the prompt, supervisors are able to do two functions:
1.View Product Sales by Department
2.Create a New Department: With this option, Supervisors are able to create a new Department such as "Books,Electronic devices" as well as the Overhead costs associated with the new department.

