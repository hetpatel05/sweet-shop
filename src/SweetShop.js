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

  deleteSweet(id) {
    if (id === null || id === undefined) {
      throw new Error('Sweet ID cannot be null or undefined.');
    }
    if (typeof id !== 'number') {
      throw new Error('Sweet ID must be a number.');
    }
    if (id <= 0) {
      throw new Error('Sweet ID must be a positive number.');
    }

    const sweetIndex = this.sweets.findIndex(sweet => sweet.id === id);

    if (sweetIndex === -1) {
      throw new Error(`Sweet with ID ${id} not found.`);
    }

    const [deletedSweet] = this.sweets.splice(sweetIndex, 1);
    return deletedSweet;
  }

  getSweets() {
        return this.sweets.filter(sweet => sweet.quantity > 0);
    }

   
  
}

module.exports = SweetShop;
