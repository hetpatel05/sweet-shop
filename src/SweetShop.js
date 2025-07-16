class SweetShop {
  constructor() {
    this.sweets = [];
  }

  addSweet(id, name, category, price, quantity) {
    if (!id || !name || !category || price == null || quantity == null) {
      throw new Error('All fields are required.');
    }

    if (typeof price !== 'number' || typeof quantity !== 'number') {
      throw new Error('Price and quantity must be numbers.');
    }

    if (price < 0 || quantity < 0) {
      throw new Error('Price and quantity cannot be negative.');
    }

    const existingSweet = this.sweets.find(sweet => sweet.id === id);
    if (existingSweet) {
      throw new Error('Sweet with this ID already exists.');
    }
    this.sweets.push({ id, name, category, price, quantity });
  }

  getSweets() {
    return this.sweets;
  }
}

module.exports = SweetShop;
