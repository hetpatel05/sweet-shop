const readline = require('readline');
const SweetShop = require('./src/SweetShop'); // Assuming SweetShop.js is in the same directory

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const shop = new SweetShop();

// Initialize with some data for demonstration
function initializeShop() {
    try {
        shop.addSweet(101, 'Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet(102, 'Gulab Jamun', 'Milk-Based', 10, 50);
        shop.addSweet(103, 'Chocolate Bar', 'Chocolate', 25, 15);
        shop.addSweet(104, 'Rasgulla', 'Milk-Based', 12, 0); // Out of stock
        shop.addSweet(105, 'Coconut Barfi', 'Nut-Based', 45, 10);
        shop.addSweet(106, 'Dark Chocolate Truffle', 'Chocolate', 60, 5);
        shop.addSweet(107, 'Lemon Drops', 'Candy', 5, 25);
        console.log('Shop initialized with some sweets!');
    } catch (e) {
        console.error('Error initializing shop:', e.message);
    }
}

function displayMenu() {
    console.log('\n--- Sweet Shop Management ---');
    console.log('1. Add Sweet');
    console.log('2. View Available Sweets');
    console.log('3. Search Sweets');
    console.log('4. Purchase Sweet');
    console.log('5. Restock Sweet');
    console.log('6. Delete Sweet');
    console.log('7. Exit');
    console.log('-----------------------------');
}

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function handleAddSweet() {
    console.log('\n--- Add New Sweet ---');
    try {
        const id = parseInt(await askQuestion('Enter Sweet ID (number): '), 10);
        const name = await askQuestion('Enter Sweet Name: ');
        const category = await askQuestion('Enter Sweet Category: ');
        const price = parseFloat(await askQuestion('Enter Sweet Price: '));
        const quantity = parseInt(await askQuestion('Enter Sweet Quantity: '), 10);

        shop.addSweet(id, name, category, price, quantity);
        console.log(`Sweet "${name}" (ID: ${id}) added successfully!`);
    } catch (error) {
        console.error('Error adding sweet:', error.message);
    } finally {
        mainMenu();
    }
}

async function handleViewSweets() {
    console.log('\n--- Available Sweets (In Stock) ---');
    const sweets = shop.getSweets();
    if (sweets.length === 0) {
        console.log('No sweets currently in stock.');
    } else {
        sweets.forEach(sweet => {
            console.log(`ID: ${sweet.id}, Name: ${sweet.name}, Category: ${sweet.category}, Price: $${sweet.price}, Quantity: ${sweet.quantity}`);
        });
    }
    mainMenu();
}

async function handleSearchSweets() {
    console.log('\n--- Search Sweets ---');
    console.log('Enter search criteria (leave blank for no filter):');
    const name = await askQuestion('Search by Name (partial, case-insensitive): ');
    const category = await askQuestion('Search by Category (partial, case-insensitive): ');
    let minPriceInput = await askQuestion('Search by Minimum Price: ');
    let maxPriceInput = await askQuestion('Search by Maximum Price: ');

    let minPrice = undefined;
    let maxPrice = undefined;

    if (minPriceInput !== '') {
        minPrice = parseFloat(minPriceInput);
    }
    if (maxPriceInput !== '') {
        maxPrice = parseFloat(maxPriceInput);
    }

    try {
        const searchParams = {};
        if (name !== '') searchParams.name = name;
        if (category !== '') searchParams.category = category;
        if (minPrice !== undefined) searchParams.minPrice = minPrice;
        if (maxPrice !== undefined) searchParams.maxPrice = maxPrice;

        const results = shop.searchSweets(searchParams);

        if (results.length === 0) {
            console.log('No sweets found matching your criteria.');
        } else {
            console.log('\n--- Search Results ---');
            results.forEach(sweet => {
                console.log(`ID: ${sweet.id}, Name: ${sweet.name}, Category: ${sweet.category}, Price: $${sweet.price}, Quantity: ${sweet.quantity}`);
            });
        }
    } catch (error) {
        console.error('Error during search:', error.message);
    } finally {
        mainMenu();
    }
}

async function handlePurchaseSweet() {
    console.log('\n--- Purchase Sweet ---');
    try {
        const id = parseInt(await askQuestion('Enter Sweet ID to purchase: '), 10);
        const quantity = parseInt(await askQuestion('Enter Quantity to purchase: '), 10);

        const updatedSweet = shop.purchaseSweet(id, quantity);
        console.log(`Successfully purchased ${quantity} of "${updatedSweet.name}". New quantity: ${updatedSweet.quantity}`);
    } catch (error) {
        console.error('Error purchasing sweet:', error.message);
    } finally {
        mainMenu();
    }
}

async function handleRestockSweet() {
    console.log('\n--- Restock Sweet ---');
    try {
        const id = parseInt(await askQuestion('Enter Sweet ID to restock: '), 10);
        const quantity = parseInt(await askQuestion('Enter Quantity to restock: '), 10);

        const updatedSweet = shop.restockSweet(id, quantity);
        console.log(`Successfully restocked ${quantity} of "${updatedSweet.name}". New quantity: ${updatedSweet.quantity}`);
    } catch (error) {
        console.error('Error restocking sweet:', error.message);
    } finally {
        mainMenu();
    }
}

async function handleDeleteSweet() {
    console.log('\n--- Delete Sweet ---');
    try {
        const id = parseInt(await askQuestion('Enter Sweet ID to delete: '), 10);

        const deletedSweet = shop.deleteSweet(id);
        console.log(`Sweet "${deletedSweet.name}" (ID: ${deletedSweet.id}) deleted successfully.`);
    } catch (error) {
        console.error('Error deleting sweet:', error.message);
    } finally {
        mainMenu();
    }
}

async function mainMenu() {
    displayMenu();
    const choice = await askQuestion('Enter your choice: ');

    switch (choice.trim()) {
        case '1':
            await handleAddSweet();
            break;
        case '2':
            await handleViewSweets();
            break;
        case '3':
            await handleSearchSweets();
            break;
        case '4':
            await handlePurchaseSweet();
            break;
        case '5':
            await handleRestockSweet();
            break;
        case '6':
            await handleDeleteSweet();
            break;
        case '7':
            console.log('Exiting Sweet Shop Management. Goodbye!');
            rl.close();
            break;
        default:
            console.log('Invalid choice. Please try again.');
            mainMenu();
            break;
    }
}

// Start the application
initializeShop();
mainMenu();