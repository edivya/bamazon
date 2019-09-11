var mysql = require("mysql");
var inquirer = require("inquirer");

//cli-color npm package will (hopefully) give color.
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

//pre-defined color for inquirer text.
var textColor = clc.red.bold;
var inquirerColor = clc.blue;

//console.log(textColor("Is this working"));


function start() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: inquirerColor("Thank you for shopping with Bamazon! Would you like to purchase an item?"),
        default: true

    }]).then(function (user) {
        if (user.confirm === true) {
            chooseDepartment();
        } else {
            console.log("Thank you! Your session has ended");
        }
    });
}

function anythingElse() {
    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Would you like to purchase an additional item today?",
        default: true

    }]).then(function (user) {
        if (user.confirm === true) {
            chooseDepartment();
        } else {
            console.log(textColor("Thank you for shopping with Bamazon!"));
            connection.end();
        }
    });
}

// function which prompts the user for what action they should take
function chooseDepartment() {
    inquirer
        .prompt({
            name: "departmentChoice",
            type: "rawlist",
            message: "Please enter the number for the department you like to shop in today?",
            choices: ["ELECTRONICS", "JEWELRY", "COLLECTIBLES", "CLOTHING/ACCESSORIES", "ART", "VIEW ALL PRODUCTS"]
        })
        .then(function (answer) {
            //the function that runs depends on the department
            if (answer.departmentChoice.toUpperCase() === "ELECTRONICS") {
                //function if the user chooses electronics    
                electronics();
            } else if (answer.departmentChoice.toUpperCase() === "JEWELRY") {
                //function if the user chooses jewelry  
                jewelry();
            } else if (answer.departmentChoice.toUpperCase() === "COLLECTIBLES") {
                //function if the user chooses collectibles
                collectibles();
            } else if (answer.departmentChoice.toUpperCase() === "CLOTHING/ACCESSORIES") {
                //function if the user chooses clothing/accessories
                clothing();
            } else if (answer.departmentChoice.toUpperCase() === "ART") {
                //function if the user chooces art
                art();
            } else if (answer.departmentChoice.toUpperCase() === "VIEW ALL PRODUCTS") {
                //function if the user wants to see all products
                viewAllProducts();

            }
        });
}

function userID() {

    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Please review the Item ID's and make a selection."
    },

    {
        name: "stock",
        type: "input",
        message: "PLEASE ENTER A QUANTITY."
    }
    ])
        .then(function (answer) {

            var query = "SELECT * FROM PRODUCTS Where ?";

            connection.query(query, {ID: answer.id}, function (error, response) {
                if (error) {
                    console.log("I'm sorry. An error occurred")
                };

                if (response[0].STOCK_QUANTITY < answer.stock && response[0].STOCK_QUANTITY > 0) {
                    console.log("\n");
                    console.log(textColor("Insufficient quantity. Bamazon currently has " + response[0].STOCK_QUANTITY + " available. Please choose another amount.\n"));
                    userID();
                } else if (response[0].STOCK_QUANTITY === 0) {
                    console.log("\n");
                    console.log(textColor("I'm sorry. Bamazon is out of that product.\n"));

                    chooseDepartment();
                } else if (response[0].STOCK_QUANTITY >= answer.stock) {
                    console.log("\n")
                    console.log(textColor("Thank you ordering the item: " + response[0].PRODUCT_NAME + ". It is in queue for shipping.\n"));

                    // Update the mySQL Database

                    connection.query("UPDATE PRODUCTS SET ? WHERE ?", [
                        {
                            STOCK_QUANTITY: response[0].STOCK_QUANTITY - answer.stock
                        },
                        {
                            ID: answer.id
                        }
                    ], 
                    function (error, data) {
                        if (error) {
                            console.log("I'm sorry. Bamazon is currently down.  Try again later.")
                        }

                    })
                    connection.query("UPDATE PRODUCTS SET ? WHERE ?", [
                        {
                            PRODUCT_SALES: response[0].PRICE * answer.stock
                        },
                        {
                            ID: answer.id
                        }
                    ], 
                    function (error, data) {
                        if (error) {
                            console.log("I'm sorry. Bamazon is currently down.  Try again later.")
                        }

                       else { console.log("Your order has been shipped! You have been charged $" + response[0].PRICE * answer.stock + "\n");
                        console.log("\n--------------------------------------------") }
                        anythingElse();

                    })

                }
            });
        });
}

//function called if they choose electronics
function electronics() {

    console.log(textColor("Thank you for purchasing from our Electronics Department!\n"));
    console.log(textColor("The following items are available. \n"));

    var query = "SELECT ID, products_name, PRICE FROM PRODUCTS WHERE DEPARTMENT_ID = 'ELECTRONICS'";

    connection.query(query, function (err, results) {
        if (err) throw err;
        var itemsInString = '';
        for (var i = 0; i < results.length; i++) {
            itemsInString = '';
            itemsInString += 'Item ID: ' + results[i].ID + ' || ';
            itemsInString += 'Product Name: ' + results[i].products_name + ' || ';
            itemsInString += 'Price: $' + results[i].PRICE;

            console.log("\n" + itemsInString);
                    
        };
        console.log("\n------------------------------");
        console.log("Please enter the Item ID of the item you wish to purchase.")
});
userID();
}

//function called if they choose ART
function art() {

    console.log("Thank you for purchasing from from our Art Department!\n")
    console.log(inquirerColor("Items Available: \n"));

    var query = "SELECT ID, products_name, PRICE FROM PRODUCTS WHERE DEPARTMENT_ID = 'ART'";

    connection.query(query, function (err, results) {
        if (err) throw err;
        var itemsInString = '';
        for (var i = 0; i < results.length; i++) {
            itemsInString = '';
            itemsInString += 'Item ID: ' + results[i].ID + ' || ';
            itemsInString += 'Product Name: ' + results[i].products_name + ' || ';
            itemsInString += 'Price: $' + results[i].PRICE;

            console.log("\n" + itemsInString);
                    
        };
        console.log("\n------------------------------");
        console.log("Please enter the Item ID of the item you wish to purchase.")
});
userID();
}

//function called if they choose clothing/accessories
function clothing() {

    console.log("Thank you for purchasing from our Clothing & Accessories Department!\n")
    console.log(inquirerColor("Items Available: \n"));

    var query = "SELECT ID, products_name, PRICE FROM PRODUCTS WHERE DEPARTMENT_ID = 'CLOTHING/ACCESSORIES'";

    connection.query(query, function (err, results) {
        if (err) throw err;
        var itemsInString = '';
        for (var i = 0; i < results.length; i++) {
            itemsInString = '';
            itemsInString += 'Item ID: ' + results[i].ID + ' || ';
            itemsInString += 'Product Name: ' + results[i].products_name + ' || ';
            itemsInString += 'Price: $' + results[i].PRICE;

            console.log("\n" + itemsInString);
                    
        };
        console.log("\n------------------------------");
        console.log("Please enter the Item ID of the item you wish to purchase.")
});
userID();
}

//function called if they choose collectibles
function collectibles() {

    console.log("Thank you for purchasing from our Collectibles Department!\n")
    console.log(inquirerColor("Items Available: \n"));

    var query = "SELECT ID, products_name, PRICE FROM PRODUCTS WHERE DEPARTMENT_ID = 'COLLECTIBLES'";

    connection.query(query, function (err, results) {
        if (err) throw err;
        var itemsInString = '';
        for (var i = 0; i < results.length; i++) {
            itemsInString = '';
            itemsInString += 'Item ID: ' + results[i].ID + ' || ';
            itemsInString += 'Product Name: ' + results[i].products_name + ' || ';
            itemsInString += 'Price: $' + results[i].PRICE;

            console.log("\n" + itemsInString);
                    
        };
        console.log("\n------------------------------");
        console.log("Please enter the Item ID of the item you wish to purchase.")
});
userID();
}

//function called if they choose jewelry
function jewelry() {

    console.log("Thank you for purchasing from our Jewelry Department!\n")
    console.log(inquirerColor("Items Available: \n"));

    var query = "SELECT ID, products_name, PRICE FROM PRODUCTS WHERE DEPARTMENT_ID = 'JEWELRY'";

    connection.query(query, function (err, results) {
        if (err) throw err;
        var itemsInString = '';
        for (var i = 0; i < results.length; i++) {
            itemsInString = '';
            itemsInString += 'Item ID: ' + results[i].ID + ' || ';
            itemsInString += 'Product Name: ' + results[i].products_name + ' || ';
            itemsInString += 'Price: $' + results[i].PRICE;

            console.log("\n" + itemsInString);
                    
        };
        console.log("\n------------------------------");
        console.log("Please enter the Item ID of the item you wish to purchase.")
});
userID();
}

//function called if they choose to view all products
function  viewAllProducts() {

    console.log("Ever item in Bamazon will be listed below\n")
    console.log(inquirerColor("Items Available: \n"));

    var query = "SELECT ID, products_name, PRICE FROM PRODUCTS";

    connection.query(query, function (err, results) {
        if (err) throw err;
        var itemsInString = '';
        for (var i = 0; i < results.length; i++) {
            itemsInString = '';
            itemsInString += 'Item ID: ' + results[i].ID + ' || ';
            itemsInString += 'Product Name: ' + results[i].products_name + ' || ';
            itemsInString += 'Price: $' + results[i].PRICE;

            console.log("\n" + itemsInString);
                    
        };
        console.log("\n------------------------------");
        console.log("Please enter the Item ID of the item you wish to purchase.")
});
userID();
}
