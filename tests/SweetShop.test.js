const SweetShop = require('../src/SweetShop');

describe('SweetShop', () => {
  let sweetShop;

  beforeEach(() => {
    sweetShop = new SweetShop();
  });

  test('should add a new sweet to the shop', () => {
    sweetShop.addSweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20);
    const sweets = sweetShop.getSweets();
    expect(sweets).toHaveLength(1);
    expect(sweets[0]).toEqual({
      id: 1001,
      name: 'Kaju Katli',
      category: 'Nut-Based',
      price: 50,
      quantity: 20,
    });
  });

  test('should throw an error when adding a sweet with a duplicate ID', () => {
    sweetShop.addSweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20);
    expect(() => {
      sweetShop.addSweet(1001, 'Gajar Halwa', 'Vegetable-Based', 30, 15);
    }).toThrow('Sweet with this ID already exists.');
  });

  test('should throw an error if any of the required fields are missing', () => {
    expect(() => sweetShop.addSweet(null, 'Kaju Katli', 'Nut-Based', 50, 20)).toThrow('All fields are required.');
    expect(() => sweetShop.addSweet(1001, null, 'Nut-Based', 50, 20)).toThrow('All fields are required.');
    expect(() => sweetShop.addSweet(1001, 'Kaju Katli', null, 50, 20)).toThrow('All fields are required.');
    expect(() => sweetShop.addSweet(1001, 'Kaju Katli', 'Nut-Based', null, 20)).toThrow('All fields are required.');
    expect(() => sweetShop.addSweet(1001, 'Kaju Katli', 'Nut-Based', 50, null)).toThrow('All fields are required.');
  });

  test('should throw an error if price or quantity are not numbers', () => {
    expect(() => sweetShop.addSweet(1001, 'Kaju Katli', 'Nut-Based', '50', 20)).toThrow('Price and quantity must be numbers.');
    expect(() => sweetShop.addSweet(1001, 'Kaju Katli', 'Nut-Based', 50, '20')).toThrow('Price and quantity must be numbers.');
  });

  test('should throw an error if price or quantity are negative numbers', () => {
    expect(() => sweetShop.addSweet(1002, 'Jalebi', 'Syrup-Based', -10, 20)).toThrow('Price and quantity cannot be negative.');
    expect(() => sweetShop.addSweet(1003, 'Rasgulla', 'Milk-Based', 10, -5)).toThrow('Price and quantity cannot be negative.');
  });
});
