var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

//cli-color npm package will give color.
var clc = require('cli-color');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "123456",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

//color for viewing products for sale
var saleColor = clc.green;

//color for viewing low inventory
var lowInventoryColor = clc.blue;

//color for adding inventory
var newInventoryColor = clc.cyanBright;

//color for adding a new product
var newProductColor = clc.yellow;

function start() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome, Manager! Would you like to access the database?",
        default: true

    }]).then(function (user) {
        if (user.confirm === true) {
            chooseAction();
        } else {
            console.log("Thank you! Your session has ended. Goodbye.");
            connection.end();
        }
    });
}

function chooseAction() {// function which prompts the user for what action they should take
    inquirer
        .prompt([{
            name: "doToday",
            type: "rawlist",
            message: "What action would you like to take? (Please enter the item number)",
            choices: ["VIEW PRODUCTS FOR SALE", "VIEW LOW INVENTORY", "ADD INVENTORY", "ADD NEW PRODUCTS"]
        }])
        .then(function (answer) {

            //the function that runs depends on the department
            if (answer.doToday.toUpperCase() === "VIEW PRODUCTS FOR SALE") {
                //function if the user chooses to view all products for sale    
                viewProducts();
            } else if (answer.doToday.toUpperCase() === "VIEW LOW INVENTORY") {
                //function if the user chooses to view low inventory  
                viewLowInventory();
            } else if (answer.doToday.toUpperCase() === "ADD INVENTORY") {
                //function if the user chooses to add inventory
                addInventory();
            } else if (answer.doToday.toUpperCase() === "ADD NEW PRODUCTS") {
                //function if the user chooses to add new products
                addProducts();
            }
        });
}

function viewProducts() {
    //testing function
    // prompt for info about the item being put up for auction
    inquirer
        .prompt([
            {
                name: "confirm",
                type: "confirm",
                message: saleColor("Would you like to view all products currently for sale in Bamazon?"),
                default: true
            }])
        .then(function (user) {
            if (user.confirm === true) {
                console.log(saleColor("Items Available: \n"));

                connection.query('SELECT * FROM PRODUCTS', function (error, res) {
                    //console.log(res);

                    if (error) throw error;
                    var table = new Table({
                        head: ['id', 'products_name', 'department_id', 'price', 'stock_quantity']
                    });
            
                    for (i = 0; i < res.length; i++) {
                        table.push(
                            [res[i].id, res[i].products_name, res[i].department_id, "$" + res[i].price, res[i].stock_quantity]
                        );
                    }
                    //console.log(table);
                    console.log(table.toString());
                    start();
                });
            } else {
                console.log("Returning to main menu...");
                chooseAction();
            }
        });
};

function viewLowInventory() {
    //testing function
    // prompt for info about the item being put up for auction
    inquirer
        .prompt([
            {
                name: "confirm",
                type: "confirm",
                message: lowInventoryColor("Would you like to view all products with less than 5 items in stock?"),
                default: true
            }])
        .then(function (user) {
            if (user.confirm === true) {
                console.log(lowInventoryColor("The following items have low inventory: \n"));

                var query = "SELECT ID, PRODUCT_NAME, STOCK_QUANTITY FROM PRODUCTS WHERE STOCK_QUANTITY <= '5'";

                connection.query(query, function (err, results) {
                    if (err) throw err;
                    var itemsInString = '';
                    for (var i = 0; i < results.length; i++) {
                        itemsInString = '';
                        itemsInString += 'Item ID: ' + results[i].ID + ' || ';
                        itemsInString += 'Product Name: ' + results[i].PRODUCT_NAME + ' || ';
                        itemsInString += 'Stock Quantity: ' + results[i].STOCK_QUANTITY;

                        console.log("\n" + itemsInString);

                    };
                    console.log("\n------------------------------");
                    console.log(lowInventoryColor("If you would like to add inventory to any items, choose 'ADD INVENTORY' from the menu below."));
                    chooseAction();

                });
            } else {
                console.log("Returning to main menu...");
                start();
            }
        });
};

function getItemsforInventory() {
    console.log(newInventoryColor("You have chosen to add new inventory. The following items are available for updates: \n"));

    var query = "SELECT * FROM PRODUCTS";

    connection.query(query, function (err, results) {
        if (err) throw err;
        var itemsInString = '';
        for (var i = 0; i < results.length; i++) {
            itemsInString = '';
            itemsInString += 'Item ID: ' + results[i].ID + ' || ';
            itemsInString += 'Product: ' + results[i].PRODUCT_NAME + ' || ';
            itemsInString += 'Product: ' + results[i].STOCK_QUANTITY;


            console.log("\n" + itemsInString);

        };
        console.log("\n------------------------------");

    });
};

    function addInventory() {
        getItemsforInventory();
        inquirer
            .prompt([
                {
                    name: "product",
                    type: "input",
                    message: newProductColor("Use the list of products and enter the ID number of the product you would like to update")
                },
                {
                    name: "amount",
                    type: "input",
                    message: newProductColor("Please enter the new amount of inventory."),
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },

            ])
            .then(function (answer) {
                connection.query(
                    "UPDATE PRODUCTS SET ? WHERE ?",
                    [
                        {
                            STOCK_QUANTITY: answer.amount
                        },
                        {
                            ID: answer.amount
                        }
                    ], function (err) {
                        if (err) throw err;
                        console.log(newProductColor("You have successfully added " + answer.amount + " items to the stock quantity.\n"));
                        // Head back to the start function
                        start();
                    }
                )
            })
    }




    function addProducts() {
        //testing function
        // prompt for info about the item being added
        inquirer
            .prompt([
                {
                    name: "product",
                    type: "input",
                    message: newProductColor("What is the product you would like to add?")
                },
                {
                    name: "department",
                    type: "input",
                    message: newProductColor("Please add which department your product belongs in.")
                },
                {
                    name: "price",
                    type: "input",
                    message: newProductColor("Enter the price of the product in decimal form with no dollar sign."),
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "stock",
                    type: "input",
                    message: newProductColor("Enter the amount of items available for purchase."),
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO PRODUCTS SET ?",
                    {
                        PRODUCT_NAME: answer.product,
                        DEPARTMENT_ID: answer.department,
                        PRICE: answer.price,
                        STOCK_QUANTITY: answer.stock
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(newProductColor("You have successfully added " + answer.stock + " " + answer.product + "(s) for a cost of " + answer.price + " each.\n"));
                        // back to the start
                        start();
                    }
                );
            });
    };