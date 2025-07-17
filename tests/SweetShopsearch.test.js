const SweetShop = require('../src/SweetShop');

describe('SweetShop - Search Sweets by Name, Category, Price Range', () => {
    let shop;

    beforeEach(() => {
        shop = new SweetShop();
        // Add a diverse set of sweets for comprehensive testing
        shop.addSweet(101, 'Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet(102, 'Gulab Jamun', 'Milk-Based', 10, 50);
        shop.addSweet(103, 'Chocolate Bar', 'Chocolate', 25, 15);
        shop.addSweet(104, 'Rasgulla', 'Milk-Based', 12, 0); // Out of stock
        shop.addSweet(105, 'Coconut Barfi', 'Nut-Based', 45, 10);
        shop.addSweet(106, 'Dark Chocolate Truffle', 'Chocolate', 60, 5);
        shop.addSweet(107, 'Lemon Drops', 'Candy', 5, 25);
    });

    // --- Search by Name ---
    describe('Search by Name', () => {
        test('should find sweets by exact full name (case-insensitive)', () => {
            const results = shop.searchSweets({ name: 'kaju katli' });
            expect(results).toHaveLength(1);
            expect(results[0]).toEqual({ id: 101, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 });
        });

        test('should find sweets by partial name (case-insensitive)', () => {
            const results = shop.searchSweets({ name: 'choc' });
            expect(results).toHaveLength(2); // Chocolate Bar, Dark Chocolate Truffle
            expect(results).toEqual(expect.arrayContaining([
                { id: 103, name: 'Chocolate Bar', category: 'Chocolate', price: 25, quantity: 15 },
                { id: 106, name: 'Dark Chocolate Truffle', category: 'Chocolate', price: 60, quantity: 5 }
            ]));
        });

        test('should return an empty array if no sweet names match', () => {
            const results = shop.searchSweets({ name: 'nonexistent' });
            expect(results).toHaveLength(0);
        });

        test('should be case-insensitive for the search query', () => {
            const results1 = shop.searchSweets({ name: 'gULab jAmUN' });
            expect(results1).toHaveLength(1);
            expect(results1[0]).toEqual({ id: 102, name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 50 });

            const results2 = shop.searchSweets({ name: 'CHOCOLATE' });
            expect(results2).toHaveLength(2);
        });

        test('should not return out-of-stock sweets when searching by name', () => {
            const results = shop.searchSweets({ name: 'rasgulla' });
            expect(results).toHaveLength(0); // Rasgulla is out of stock (quantity 0)
        });

        test('should handle empty string name query by returning all in-stock sweets', () => {
            const results = shop.searchSweets({ name: '' });
            // Should return all in-stock sweets: 101, 102, 103, 105, 106, 107 (6 sweets)
            // Sweet 104 (Rasgulla) should be excluded due to quantity 0
            expect(results).toHaveLength(6);
            expect(results.some(s => s.id === 104)).toBe(false);
        });

        test('should handle null or undefined name query by returning all in-stock sweets', () => {
            const results1 = shop.searchSweets({ name: null });
            expect(results1).toHaveLength(6);

            const results2 = shop.searchSweets({ name: undefined });
            expect(results2).toHaveLength(6);
        });
    });

    // --- Search by Category ---
    describe('Search by Category', () => {
        test('should find sweets by exact full category (case-insensitive)', () => {
            const results = shop.searchSweets({ category: 'nut-based' });
            expect(results).toHaveLength(2); // Kaju Katli, Coconut Barfi
            expect(results).toEqual(expect.arrayContaining([
                { id: 101, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
                { id: 105, name: 'Coconut Barfi', category: 'Nut-Based', price: 45, quantity: 10 }
            ]));
        });

        test('should find sweets by partial category (case-insensitive)', () => {
            const results = shop.searchSweets({ category: 'milk' });
            expect(results).toHaveLength(1); // Gulab Jamun (Rasgulla is out of stock)
            expect(results[0]).toEqual({ id: 102, name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 50 });
        });

        test('should return an empty array if no sweet categories match', () => {
            const results = shop.searchSweets({ category: 'fruit' });
            expect(results).toHaveLength(0);
        });

        test('should be case-insensitive for the search query', () => {
            const results = shop.searchSweets({ category: 'CHOCOLATE' });
            expect(results).toHaveLength(2); // Chocolate Bar, Dark Chocolate Truffle
        });

        test('should not return out-of-stock sweets when searching by category', () => {
            const results = shop.searchSweets({ category: 'milk-based' }); // Gulab Jamun (in stock), Rasgulla (out of stock)
            expect(results).toHaveLength(1);
            expect(results[0].id).toBe(102);
            expect(results.some(s => s.id === 104)).toBe(false); // Rasgulla excluded
        });
    });

    // --- Search by Price Range ---
    describe('Search by Price Range', () => {
        test('should find sweets within a specified min and max price range', () => {
            const results = shop.searchSweets({ minPrice: 20, maxPrice: 50 });
            // Expected: Kaju Katli (50), Chocolate Bar (25), Coconut Barfi (45)
            // Gulab Jamun (10) - too low
            // Lemon Drops (5) - too low
            // Dark Chocolate Truffle (60) - too high
            expect(results).toHaveLength(3);
            expect(results).toEqual(expect.arrayContaining([
                { id: 101, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
                { id: 103, name: 'Chocolate Bar', category: 'Chocolate', price: 25, quantity: 15 },
                { id: 105, name: 'Coconut Barfi', category: 'Nut-Based', price: 45, quantity: 10 }
            ]));
        });

        test('should find sweets with only a minimum price specified', () => {
            const results = shop.searchSweets({ minPrice: 40 });
            // Expected: Kaju Katli (50), Coconut Barfi (45), Dark Chocolate Truffle (60)
            expect(results).toHaveLength(3);
            expect(results).toEqual(expect.arrayContaining([
                { id: 101, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
                { id: 105, name: 'Coconut Barfi', category: 'Nut-Based', price: 45, quantity: 10 },
                { id: 106, name: 'Dark Chocolate Truffle', category: 'Chocolate', price: 60, quantity: 5 }
            ]));
        });

        test('should find sweets with only a maximum price specified', () => {
            const results = shop.searchSweets({ maxPrice: 15 });
            // Expected: Gulab Jamun (10), Lemon Drops (5)
            expect(results).toHaveLength(2);
            expect(results).toEqual(expect.arrayContaining([
                { id: 102, name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 50 },
                { id: 107, name: 'Lemon Drops', category: 'Candy', price: 5, quantity: 25 }
            ]));
        });

        test('should return an empty array if no sweets fall within the price range', () => {
            const results = shop.searchSweets({ minPrice: 100, maxPrice: 200 });
            expect(results).toHaveLength(0);
        });

        test('should return all in-stock sweets if price range is very broad', () => {
            const results = shop.searchSweets({ minPrice: 1, maxPrice: 100 });
            // Expected: All in-stock sweets (6 of them)
            expect(results).toHaveLength(6);
            expect(results.some(s => s.id === 104)).toBe(false); // Rasgulla still excluded
        });

        test('should not return out-of-stock sweets when searching by price range', () => {
            // Rasgulla (104) has price 12 but quantity 0
            const results = shop.searchSweets({ minPrice: 10, maxPrice: 15 });
            expect(results).toHaveLength(1); // Only Gulab Jamun (102)
            expect(results[0]).toEqual({ id: 102, name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 50 });
            expect(results.some(s => s.id === 104)).toBe(false);
        });

        test('should handle minPrice greater than maxPrice gracefully (return empty or throw error)', () => {
            // Decided to return empty array for invalid range, which is often user-friendlier
            const results = shop.searchSweets({ minPrice: 50, maxPrice: 20 });
            expect(results).toHaveLength(0);
        });

        test('should handle non-numeric price range inputs gracefully (return empty or throw error)', () => {
            // Decided to return empty array, or you could throw an error. For TDD, let's expect an error.
            expect(() => shop.searchSweets({ minPrice: 'twenty', maxPrice: 50 })).toThrow('Price range values must be numbers.');
            expect(() => shop.searchSweets({ minPrice: 10, maxPrice: 'fifty' })).toThrow('Price range values must be numbers.');
        });
    });

    // --- Combined Search (Multiple Criteria) ---
    describe('Combined Search', () => {
        test('should find sweets matching name and category', () => {
            const results = shop.searchSweets({ name: 'chocolate', category: 'Chocolate' });
            expect(results).toHaveLength(2);
            expect(results).toEqual(expect.arrayContaining([
                { id: 103, name: 'Chocolate Bar', category: 'Chocolate', price: 25, quantity: 15 },
                { id: 106, name: 'Dark Chocolate Truffle', category: 'Chocolate', price: 60, quantity: 5 }
            ]));
        });

        test('should find sweets matching name and price range', () => {
            const results = shop.searchSweets({ name: 'chocolate', minPrice: 50 });
            expect(results).toHaveLength(1); // Only Dark Chocolate Truffle
            expect(results[0]).toEqual({ id: 106, name: 'Dark Chocolate Truffle', category: 'Chocolate', price: 60, quantity: 5 });
        });

        test('should find sweets matching category and price range', () => {
            const results = shop.searchSweets({ category: 'Nut-Based', maxPrice: 50 });
            expect(results).toHaveLength(2); // Kaju Katli (50), Coconut Barfi (45)
            expect(results).toEqual(expect.arrayContaining([
                { id: 101, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
                { id: 105, name: 'Coconut Barfi', category: 'Nut-Based', price: 45, quantity: 10 }
            ]));
        });

        test('should find sweets matching name, category, and price range', () => {
            const results = shop.searchSweets({ name: 'chocolate', category: 'Chocolate', minPrice: 20, maxPrice: 30 });
            expect(results).toHaveLength(1); // Only Chocolate Bar
            expect(results[0]).toEqual({ id: 103, name: 'Chocolate Bar', category: 'Chocolate', price: 25, quantity: 15 });
        });

        test('should return empty if no sweets match all criteria', () => {
            const results = shop.searchSweets({ name: 'gulab', category: 'Nut-Based' });
            expect(results).toHaveLength(0);
        });

        test('should prioritize quantity filter first for all search criteria', () => {
            // Rasgulla (id 104) is out of stock (quantity 0)
            const results = shop.searchSweets({ name: 'rasgulla', category: 'Milk-Based', minPrice: 10, maxPrice: 15 });
            expect(results).toHaveLength(0); // Should not find Rasgulla because it's out of stock
        });
    });

    // --- Edge Cases for Search Function Call ---
    describe('Search Function Call Edge Cases', () => {
        test('should return all in-stock sweets if no search criteria are provided (empty object)', () => {
            const results = shop.searchSweets({});
            expect(results).toHaveLength(6); // All 6 in-stock sweets
            expect(results.some(s => s.id === 104)).toBe(false); // Rasgulla out of stock
        });

        test('should return all in-stock sweets if search criteria object is null or undefined', () => {
            const results1 = shop.searchSweets(null);
            expect(results1).toHaveLength(6);

            const results2 = shop.searchSweets(undefined);
            expect(results2).toHaveLength(6);
        });
    });
});