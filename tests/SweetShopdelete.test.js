const SweetShop = require('../src/SweetShop');

describe('SweetShop - Delete Sweets', () => {
    let shop;

    beforeEach(() => {
        // Initialize a new SweetShop instance before each test
        shop = new SweetShop();
        // Add some initial sweets for testing deletion
        shop.addSweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet(1002, 'Gulab Jamun', 'Milk-Based', 10, 50);
        shop.addSweet(1003, 'Jalebi', 'Fried', 20, 30);
    });

    test('should successfully delete an existing sweet by ID', () => {
        // Arrange
        const initialSweetCount = shop.getSweets().length; // Use getSweets() as per your class
        const sweetToDeleteId = 1002;
        // Ensure the sweet exists before attempting to delete
        expect(shop.getSweets().some(s => s.id === sweetToDeleteId)).toBe(true);

        // Act
        // This line will throw an error initially because deleteSweet is not implemented
        const deletedSweet = shop.deleteSweet(sweetToDeleteId);

        // Assert
        // Expect the returned sweet to have the correct ID and details
        expect(deletedSweet).toEqual({ id: 1002, name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 50 });
        // Sweet should no longer be in the shop's sweet list
        expect(shop.getSweets().some(s => s.id === sweetToDeleteId)).toBe(false);
        // The total number of sweets should decrease by one
        expect(shop.getSweets().length).toBe(initialSweetCount - 1);
        // Ensure other sweets are still present
        expect(shop.getSweets().some(s => s.id === 1001)).toBe(true);
        expect(shop.getSweets().some(s => s.id === 1003)).toBe(true);
    });

    test('should throw an error when attempting to delete a non-existent sweet', () => {
        // Arrange
        const nonExistentSweetId = 9999;
        const initialSweetCount = shop.getSweets().length;
        // Ensure the sweet does not exist
        expect(shop.getSweets().some(s => s.id === nonExistentSweetId)).toBe(false);

        // Act & Assert
        // Expect this call to throw an error
        expect(() => shop.deleteSweet(nonExistentSweetId)).toThrow(`Sweet with ID ${nonExistentSweetId} not found.`);
        // Assert that the number of sweets remains unchanged
        expect(shop.getSweets().length).toBe(initialSweetCount);
    });

    test('should throw an error when attempting to delete with an invalid ID type (e.g., string)', () => {
        // Arrange
        const invalidId = 'not-a-number';
        const initialSweetCount = shop.getSweets().length;

        // Act & Assert
        // Expect this call to throw an error for invalid ID type
        expect(() => shop.deleteSweet(invalidId)).toThrow('Sweet ID must be a number.'); // Or a more specific error you define
        // Assert that the number of sweets remains unchanged
        expect(shop.getSweets().length).toBe(initialSweetCount);
    });

    test('should throw an error when attempting to delete with a negative ID', () => {
        // Arrange
        const negativeId = -100;
        const initialSweetCount = shop.getSweets().length;

        // Act & Assert
        expect(() => shop.deleteSweet(negativeId)).toThrow('Sweet ID must be a positive number.'); // Based on your addSweet validation
        expect(shop.getSweets().length).toBe(initialSweetCount);
    });

    test('should correctly handle deleting the only sweet in the shop', () => {
        // Arrange
        const singleSweetShop = new SweetShop();
        singleSweetShop.addSweet(2001, 'Rasgulla', 'Milk-Based', 15, 10);
        expect(singleSweetShop.getSweets().length).toBe(1);

        // Act
        const deletedSweet = singleSweetShop.deleteSweet(2001);

        // Assert
        expect(deletedSweet).toEqual({ id: 2001, name: 'Rasgulla', category: 'Milk-Based', price: 15, quantity: 10 });
        expect(singleSweetShop.getSweets().length).toBe(0); // Shop should be empty
        expect(singleSweetShop.getSweets().some(s => s.id === 2001)).toBe(false);
    });

    test('should not modify the shop if multiple deletion attempts for the same ID occur after first successful deletion', () => {
    
        const sweetToDeleteId = 1001;
        const initialSweetCount = shop.getSweets().length;

        // Act - First deletion (will fail initially, but when implemented should succeed)
        const deletedSweet = shop.deleteSweet(sweetToDeleteId);
        expect(deletedSweet).toEqual({ id: 1001, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 });
        expect(shop.getSweets().length).toBe(initialSweetCount - 1); // Length should be decreased

        // Act - Second deletion attempt for the same ID (this should now throw an error)
        expect(() => shop.deleteSweet(sweetToDeleteId)).toThrow(`Sweet with ID ${sweetToDeleteId} not found.`);
        // Assert that the sweet count remains the same after the second failed attempt
        expect(shop.getSweets().length).toBe(initialSweetCount - 1);
    });

    test('should throw an error when attempting to delete with a null or undefined ID', () => {
       
        const initialSweetCount = shop.getSweets().length;

        
        expect(() => shop.deleteSweet(null)).toThrow('Sweet ID cannot be null or undefined.');
        expect(() => shop.deleteSweet(undefined)).toThrow('Sweet ID cannot be null or undefined.');
        expect(shop.getSweets().length).toBe(initialSweetCount);
    });
});