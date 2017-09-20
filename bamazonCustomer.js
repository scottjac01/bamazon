// Requires mysql
var mysql = require("mysql");

//Requires inquirer
var inquirer = require("inquirer");

//Requires fs
var fs = require("fs");
var logfile = "logfile.txt";


require("console.table");

//create a sql connection to the bamazon database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Tb2xibNwIF!4E$@NE!",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    displayProducts();
});

function displayProducts() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        // Display the result of the query in a table
        console.log("\n");
        console.table(res);
        console.log("---------------------------------------------------------------------");
    });
}

//questions to be asked and answered
var questions = [{
    type: "input",
    name: "itemPicked",
    message: "Enter in the item_id you'd like to purchase",
    validate: function(value) {
        if (value.length) {
            return true;
        } else {
            return 'Please enter a item_id.';
        }
    }
}, {
    message: "How many do you want to purchase.",
    type: "input",
    name: "quantity",
    validate: function(value) {
        if (value.length) {
            return true;
        } else {
            return 'Please enter a quantity.';
        }
    }
}];

//Launch the questions and use the answer
inquirer.prompt(questions).then(function(answers) {
    var itemSelected = answers.itemPicked;
    var numItems = answers.quantity;

    //determine if the order can be filled.  If so update table quanity and show user the price
    var query = "SELECT stock_quantity, product_name, price FROM products WHERE ? ";
    connection.query(query, {
        item_id: itemSelected
    }, function(err, res) {
        if (err) throw err;

        if (res[0].stock_quantity >= 1) {
            console.log("Thank you for your purchase of the " + res[0].product_name + ",\n" +
                "Your account will be charged $" + (res[0].price * numItems) + ".00");

            fs.appendFile(logfile, `Sold ${numItems} of the ${res[0].product_name}\n`, function(error) {
                // If an error was experienced we say it.
                if (error) {
                    console.log(error);
                }
            });
            updateProducts();

            function updateProducts() {
                var query = "Update products set stock_quantity = ? where item_id = ? and stock_quantity > 0";
                connection.query(query, [(res[0].stock_quantity - numItems), itemSelected], function(err1, res1) {
                    fs.appendFile(logfile, `Updated ${res[0].product_name} subtracted ${numItems} from stock_quantity\n`, function(err2) {
                        // If an error was experienced we say it.
                        if (err2) {
                            console.log(err2);
                        }
                    });
                    if (err1) throw err1;

                });
            }
            connection.end();
        } else {
            console.log(`Sorry we're currently out of ${res[0].product_name}.`);
            connection.end();
        }
    });
});