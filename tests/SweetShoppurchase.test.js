const SweetShop = require('../src/SweetShop');

describe('SweetShop - Purchase Sweets', () => {
    let shop;
    let sweet1, sweet2, sweet3, sweet4_outOfStock;

    beforeEach(() => {
        shop = new SweetShop();
        // Add sweets with various quantities for testing purchase scenarios
        sweet1 = shop.addSweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20); // Ample stock
        sweet2 = shop.addSweet(1002, 'Gulab Jamun', 'Milk-Based', 10, 1);  // Low stock
        sweet3 = shop.addSweet(1003, 'Jalebi', 'Fried', 20, 5);      // Moderate stock
        sweet4_outOfStock = shop.addSweet(1004, 'Rasgulla', 'Milk-Based', 12, 0); // Zero stock
    });

    test('should successfully decrease sweet quantity after purchase', () => {
        // Arrange
        const initialQuantity = sweet1.quantity; // 20
        const purchaseAmount = 5;

        // Act
        const purchasedSweet = shop.purchaseSweet(sweet1.id, purchaseAmount);

        // Assert
        expect(purchasedSweet).toBeDefined();
        expect(purchasedSweet.id).toBe(sweet1.id);
        // Verify the quantity in the shop's internal array
        const updatedSweetInShop = shop.getSweets().find(s => s.id === sweet1.id);
        expect(updatedSweetInShop.quantity).toBe(initialQuantity - purchaseAmount); // 20 - 5 = 15
        expect(updatedSweetInShop.quantity).toBe(15);
    });

    test('should return the updated sweet object after successful purchase', () => {
        // Arrange
        const purchaseAmount = 2;

        // Act
        const initialSweet3Quantity = sweet3.quantity;
        const purchasedSweet = shop.purchaseSweet(sweet3.id, purchaseAmount);

        // Assert
        expect(purchasedSweet).toBeDefined();
        expect(purchasedSweet.id).toBe(sweet3.id);
        expect(purchasedSweet.name).toBe('Jalebi');
        expect(purchasedSweet.quantity).toBe(initialSweet3Quantity - purchaseAmount); // 5 - 2 = 3
    });

    test('should successfully purchase the exact remaining quantity, resulting in 0 stock', () => {
        // Arrange
        const initialQuantity = sweet2.quantity; // 1
        const purchaseAmount = 1;

        // Act
        const purchasedSweet = shop.purchaseSweet(sweet2.id, purchaseAmount);

        // Assert
        expect(purchasedSweet).toBeDefined();
        expect(purchasedSweet.id).toBe(sweet2.id);
        const updatedSweetInShop = shop.sweets.find(s => s.id === sweet2.id);
        expect(updatedSweetInShop.quantity).toBe(0); // 1 - 1 = 0
        // Also check if getSweets() properly excludes it now
        expect(shop.getSweets().some(s => s.id === sweet2.id)).toBe(false);
    });

    test('should throw an error if trying to purchase more than available stock', () => {
        // Arrange
        const initialQuantity = sweet3.quantity; // 5
        const purchaseAmount = 10; // More than available

        // Act & Assert
        expect(() => shop.purchaseSweet(sweet3.id, purchaseAmount)).toThrow(`Not enough stock for ${sweet3.name}. Available: ${sweet3.quantity}, Requested: ${purchaseAmount}.`);
        // Verify quantity remains unchanged in the shop
        const sweetAfterAttempt = shop.sweets.find(s => s.id === sweet3.id);
        expect(sweetAfterAttempt.quantity).toBe(initialQuantity); // Should still be 5
    });

    test('should throw an error if trying to purchase from an out-of-stock sweet (quantity 0)', () => {
        // Arrange
        const purchaseAmount = 1;

        // Act & Assert
        expect(() => shop.purchaseSweet(sweet4_outOfStock.id, purchaseAmount)).toThrow(`Not enough stock for ${sweet4_outOfStock.name}. Available: ${sweet4_outOfStock.quantity}, Requested: ${purchaseAmount}.`);
        // Verify quantity remains 0
        const sweetAfterAttempt = shop.sweets.find(s => s.id === sweet4_outOfStock.id);
        expect(sweetAfterAttempt.quantity).toBe(0);
    });

    test('should throw an error if sweet ID does not exist', () => {
        // Arrange
        const nonExistentId = 9999;
        const purchaseAmount = 1;

        // Act & Assert
        expect(() => shop.purchaseSweet(nonExistentId, purchaseAmount)).toThrow(`Sweet with ID ${nonExistentId} not found.`);
        // Ensure overall sweet count hasn't changed
        expect(shop.sweets.length).toBe(4); // All initial 4 sweets
    });

    test('should throw an error if purchase quantity is zero', () => {
        // Arrange
        const purchaseAmount = 0;

        // Act & Assert
        expect(() => shop.purchaseSweet(sweet1.id, purchaseAmount)).toThrow('Purchase quantity must be a positive number.');
        // Quantity should remain unchanged
        const sweetAfterAttempt = shop.getSweets().find(s => s.id === sweet1.id);
        expect(sweetAfterAttempt.quantity).toBe(20);
    });

    test('should throw an error if purchase quantity is negative', () => {
        // Arrange
        const purchaseAmount = -5;

        // Act & Assert
        expect(() => shop.purchaseSweet(sweet1.id, purchaseAmount)).toThrow('Purchase quantity must be a positive number.');
        // Quantity should remain unchanged
        const sweetAfterAttempt = shop.getSweets().find(s => s.id === sweet1.id);
        expect(sweetAfterAttempt.quantity).toBe(20);
    });

    test('should throw an error if purchase quantity is not a number', () => {
        // Arrange
        const purchaseAmount = 'ten';

        // Act & Assert
        expect(() => shop.purchaseSweet(sweet1.id, purchaseAmount)).toThrow('Purchase quantity must be a positive number.');
        // Quantity should remain unchanged
        const sweetAfterAttempt = shop.getSweets().find(s => s.id === sweet1.id);
        expect(sweetAfterAttempt.quantity).toBe(20);
    });

    test('should throw an error if sweet ID is not a positive number', () => {
        // Arrange
        const purchaseAmount = 1;

        // Act & Assert
        expect(() => shop.purchaseSweet('abc', purchaseAmount)).toThrow('Sweet ID must be a positive number.');
        expect(() => shop.purchaseSweet(0, purchaseAmount)).toThrow('Sweet ID must be a positive number.');
        expect(() => shop.purchaseSweet(-100, purchaseAmount)).toThrow('Sweet ID must be a positive number.');
    });

    test('should not modify sweet if purchase fails due to insufficient stock', () => {
        // Arrange
        const initialQuantity = sweet3.quantity; // 5
        const purchaseAmount = 10;

        // Act & Assert
        expect(() => shop.purchaseSweet(sweet3.id, purchaseAmount))
            .toThrow(`Not enough stock for ${sweet3.name}. Available: ${sweet3.quantity}, Requested: ${purchaseAmount}.`);

        const sweetAfterAttempt = shop.sweets.find(s => s.id === sweet3.id);
        expect(sweetAfterAttempt.quantity).toBe(initialQuantity); // Quantity should remain 5
    });

    test('should not modify sweet if purchase fails due to invalid ID', () => {
        // Arrange
        const initialQuantity1 = sweet1.quantity;
        const initialQuantity2 = sweet2.quantity;
        const nonExistentId = 999;
        const purchaseAmount = 1;

        // Act & Assert
        expect(() => shop.purchaseSweet(nonExistentId, purchaseAmount))
            .toThrow(`Sweet with ID ${nonExistentId} not found.`);

        expect(shop.sweets.find(s => s.id === sweet1.id).quantity).toBe(initialQuantity1);
        expect(shop.sweets.find(s => s.id === sweet2.id).quantity).toBe(initialQuantity2);
    });
});