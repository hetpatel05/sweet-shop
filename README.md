# Sweet Shop Inventory Management

This project is a simple command-line inventory management system for a sweet shop. It allows you to add, delete, search, purchase, and restock sweets.

## Getting Started

To get started, you'll need to have Node.js and npm installed. Then, you can install the project dependencies by running the following command in the project root directory:

```bash
npm install
```

Once the dependencies are installed, you can start the application using the `cli.js` file. For example:

```bash
node cli.js add --id 1 --name "Kaju Katli" --category "Nut-Based" --price 50 --quantity 20
```


![CLI in action](./images/Screenshot%202025-07-17%20145806.png)

## Running Tests

This project uses Jest for testing. You can run the test suite by running the following command:

```bash
npm test
```

This will run all the tests and generate an HTML test report in the project root directory. Here's a screenshot of the test report:
![Test Report](./images/Screenshot%202025-07-17%20145128.png)


## Features

*   **Add Sweets:** Add new sweets to the inventory with a name, category, price, and quantity.
*   **Delete Sweets:** Remove sweets from the inventory by their ID.
*   **Search Sweets:** Search for sweets by name, category, or price range.
*   **Purchase Sweets:** Purchase sweets from the inventory, which decrements the quantity.
*   **Restock Sweeets:** Restock sweets in the inventory, which increments the quantity.
*   **View Sweets:** View all the sweets in the inventory.
