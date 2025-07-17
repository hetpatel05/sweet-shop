const SweetShop = require('../src/SweetShop');

describe('SweetShop - View Sweets', () => {
    let shop;

    beforeEach(() => {
        // Fresh instance before each test
        shop = new SweetShop();
    });

    test('should return an empty array when no sweets are available', () => {
        const availableSweets = shop.getSweets();

        expect(availableSweets).toBeInstanceOf(Array);
        expect(availableSweets).toHaveLength(0);
        expect(availableSweets).toEqual([]);
    });

    test('should return all available sweets when multiple sweets are added', () => {
        shop.addSweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet(1002, 'Gulab Jamun', 'Milk-Based', 10, 50);
        shop.addSweet(1003, 'Jalebi', 'Fried', 20, 30);

        const availableSweets = shop.getSweets();

        expect(availableSweets).toBeInstanceOf(Array);
        expect(availableSweets).toHaveLength(3);

        // Check if all added sweets are returned
        expect(availableSweets).toEqual(expect.arrayContaining([
            { id: 1001, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
            { id: 1002, name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 50 },
            { id: 1003, name: 'Jalebi', category: 'Fried', price: 20, quantity: 30 }
        ]));
    });

    test('should return a copy of the sweets array to prevent external modification', () => {
        shop.addSweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20);

        const originalSweets = shop.getSweets();

        // Simulate external mutation
        originalSweets.push({ id: 9999, name: 'Fake Sweet', category: 'Test', price: 1, quantity: 1 });

        const sweetsInShop = shop.getSweets();

        // Shop's internal state should remain unaffected
        expect(sweetsInShop).toHaveLength(1);
        expect(sweetsInShop).toEqual([
            { id: 1001, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 }
        ]);

        // External copy can be mutated
        expect(originalSweets).toHaveLength(2);
        expect(originalSweets).not.toBe(sweetsInShop);
    });

    test('should reflect changes after sweets are added and then deleted', () => {
        shop.addSweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet(1002, 'Gulab Jamun', 'Milk-Based', 10, 50);
        shop.addSweet(1003, 'Jalebi', 'Fried', 20, 30);

        expect(shop.getSweets()).toHaveLength(3);

        // Delete one sweet
        shop.deleteSweet(1002);

        const availableSweets = shop.getSweets();

        // Confirm the deleted sweet is gone
        expect(availableSweets).toHaveLength(2);
        expect(availableSweets).toEqual(expect.arrayContaining([
            { id: 1001, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
            { id: 1003, name: 'Jalebi', category: 'Fried', price: 20, quantity: 30 }
        ]));
        expect(availableSweets.some(s => s.id === 1002)).toBe(false);
    });

    test('should return sweets in the order they were added', () => {
        // IDs added out of order intentionally
        shop.addSweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet(1003, 'Jalebi', 'Fried', 20, 30);
        shop.addSweet(1002, 'Gulab Jamun', 'Milk-Based', 10, 50);

        const availableSweets = shop.getSweets();

        // Check that the order of addition is preserved
        expect(availableSweets).toEqual([
            { id: 1001, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
            { id: 1003, name: 'Jalebi', category: 'Fried', price: 20, quantity: 30 },
            { id: 1002, name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 50 }
        ]);
    });
});
