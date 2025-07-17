const SweetShop = require('../src/SweetShop');

describe('SweetShop - Restock Sweets', () => {
    let shop;
    let sweet1, sweet2_lowStock, sweet3_zeroStock, sweet4_initialStock;

    beforeEach(() => {
        shop = new SweetShop();
        // Add sweets with various initial quantities for testing restock scenarios
        sweet1 = shop.addSweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20); // Regular stock
        sweet2_lowStock = shop.addSweet(1002, 'Gulab Jamun', 'Milk-Based', 10, 5); // Low stock
        sweet3_zeroStock = shop.addSweet(1003, 'Jalebi', 'Fried', 20, 0); // Out of stock
        sweet4_initialStock = shop.addSweet(1004, 'Barfi', 'Milk-Based', 40, 15); // For testing multiple restocks
    });

    test('should successfully increase sweet quantity after restock', () => {
        // Arrange
        const initialQuantity = sweet1.quantity; // 20
        const restockAmount = 10;

        // Act
        const restockedSweet = shop.restockSweet(sweet1.id, restockAmount);

        // Assert
        expect(restockedSweet).toBeDefined();
        expect(restockedSweet.id).toBe(sweet1.id);
        // Verify the quantity in the shop's internal array
        const updatedSweetInShop = shop.sweets.find(s => s.id === sweet1.id);
        expect(updatedSweetInShop.quantity).toBe(initialQuantity + restockAmount); // 20 + 10 = 30
        expect(updatedSweetInShop.quantity).toBe(30);
    });

    test('should return the updated sweet object after successful restock', () => {
        // Arrange
        const restockAmount = 15;

        // Act
        const initialSweet2Quantity = sweet2_lowStock.quantity;
        const restockedSweet = shop.restockSweet(sweet2_lowStock.id, restockAmount);

        // Assert
        expect(restockedSweet).toBeDefined();
        expect(restockedSweet.id).toBe(sweet2_lowStock.id);
        expect(restockedSweet.name).toBe('Gulab Jamun');
        expect(restockedSweet.quantity).toBe(initialSweet2Quantity + restockAmount);
    });

    test('should successfully restock an out-of-stock sweet (quantity 0)', () => {
        // Arrange
        const initialQuantity = sweet3_zeroStock.quantity; // 0
        const restockAmount = 25;
        // Ensure it's not present in getSweets() initially
        expect(shop.getSweets().some(s => s.id === sweet3_zeroStock.id)).toBe(false);


        // Act
        const restockedSweet = shop.restockSweet(sweet3_zeroStock.id, restockAmount);

        // Assert
        expect(restockedSweet).toBeDefined();
        expect(restockedSweet.id).toBe(sweet3_zeroStock.id);
        const updatedSweetInShop = shop.sweets.find(s => s.id === sweet3_zeroStock.id);
        expect(updatedSweetInShop.quantity).toBe(initialQuantity + restockAmount); // 0 + 25 = 25
        expect(updatedSweetInShop.quantity).toBe(25);
        // Ensure it's now present in getSweets()
        expect(shop.getSweets().some(s => s.id === sweet3_zeroStock.id)).toBe(true);
    });

    test('should allow multiple restock operations on the same sweet', () => {
        // Arrange
        const initialQuantity = sweet4_initialStock.quantity; // 15
        const firstRestock = 10;
        const secondRestock = 5;

        // Act
        shop.restockSweet(sweet4_initialStock.id, firstRestock);
        const sweetAfterFirstRestock = shop.sweets.find(s => s.id === sweet4_initialStock.id);
        expect(sweetAfterFirstRestock.quantity).toBe(initialQuantity + firstRestock); // 25

        const restockedSweetFinal = shop.restockSweet(sweet4_initialStock.id, secondRestock);

        // Assert
        expect(restockedSweetFinal.quantity).toBe(initialQuantity + firstRestock + secondRestock); // 15 + 10 + 5 = 30
        const updatedSweetInShop = shop.sweets.find(s => s.id === sweet4_initialStock.id);
        expect(updatedSweetInShop.quantity).toBe(30);
    });

    test('should throw an error if sweet ID does not exist', () => {
        // Arrange
        const nonExistentId = 9999;
        const restockAmount = 10;
        const initialSweetCount = shop.sweets.length;

        // Act & Assert
        expect(() => shop.restockSweet(nonExistentId, restockAmount)).toThrow(`Sweet with ID ${nonExistentId} not found.`);
        // Ensure no sweets were added or changed
        expect(shop.sweets.length).toBe(initialSweetCount);
    });

    test('should throw an error if restock quantity is zero', () => {
        // Arrange
        const initialQuantity = sweet1.quantity; // 20
        const restockAmount = 0;

        // Act & Assert
        expect(() => shop.restockSweet(sweet1.id, restockAmount)).toThrow('Restock quantity must be a positive number.');
        // Quantity should remain unchanged
        const sweetAfterAttempt = shop.sweets.find(s => s.id === sweet1.id);
        expect(sweetAfterAttempt.quantity).toBe(initialQuantity);
    });

    test('should throw an error if restock quantity is negative', () => {
        // Arrange
        const initialQuantity = sweet1.quantity; // 20
        const restockAmount = -5;

        // Act & Assert
        expect(() => shop.restockSweet(sweet1.id, restockAmount)).toThrow('Restock quantity must be a positive number.');
        // Quantity should remain unchanged
        const sweetAfterAttempt = shop.sweets.find(s => s.id === sweet1.id);
        expect(sweetAfterAttempt.quantity).toBe(initialQuantity);
    });

    test('should throw an error if restock quantity is not a number', () => {
        // Arrange
        const initialQuantity = sweet1.quantity; // 20
        const restockAmount = 'twenty';

        // Act & Assert
        expect(() => shop.restockSweet(sweet1.id, restockAmount)).toThrow('Restock quantity must be a positive number.');
        // Quantity should remain unchanged
        const sweetAfterAttempt = shop.sweets.find(s => s.id === sweet1.id);
        expect(sweetAfterAttempt.quantity).toBe(initialQuantity);
    });

    test('should throw an error if sweet ID is not a positive number', () => {
        // Arrange
        const restockAmount = 10;

        // Act & Assert
        expect(() => shop.restockSweet('abc', restockAmount)).toThrow('Sweet ID must be a positive number.');
        expect(() => shop.restockSweet(0, restockAmount)).toThrow('Sweet ID must be a positive number.');
        expect(() => shop.restockSweet(-100, restockAmount)).toThrow('Sweet ID must be a positive number.');
    });

    test('should not modify sweet if restock fails due to invalid ID', () => {
        // Arrange
        const initialQuantity1 = sweet1.quantity;
        const initialQuantity2 = sweet2_lowStock.quantity;

        // Act & Assert
        let caughtError = null;
        try {
            shop.restockSweet(9999, 10);
        } catch (error) {
            caughtError = error;
        }
        expect(caughtError).toBeInstanceOf(Error); // Ensure an error was caught
        expect(shop.sweets.find(s => s.id === sweet1.id).quantity).toBe(initialQuantity1);
        expect(shop.sweets.find(s => s.id === sweet2_lowStock.id).quantity).toBe(initialQuantity2);
    });
});