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
    const newSweet = { id, name, category, price, quantity };
    this.sweets.push(newSweet);
    return newSweet;
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

  searchSweets(criteria) {
        const { name = null, category = null, minPrice = null, maxPrice = null } = criteria || {};
        let results = this.getSweets(); // Start with all in-stock sweets

        // Validate and filter by name
        if (name !== null && name !== undefined) {
            if (typeof name !== 'string') {
                throw new Error('Search criteria: Name must be a string.');
            }
            if (name !== '') { // Apply filter only if name is not an empty string
                const lowerCaseName = name.toLowerCase();
                results = results.filter(sweet =>
                    sweet.name.toLowerCase().includes(lowerCaseName)
                );
            }
        }

        // Validate and filter by category
        if (category !== null && category !== undefined) {
            if (typeof category !== 'string') {
                throw new Error('Search criteria: Category must be a string.');
            }
            if (category !== '') { // Apply filter only if category is not an empty string
                const lowerCaseCategory = category.toLowerCase();
                results = results.filter(sweet =>
                    sweet.category.toLowerCase().includes(lowerCaseCategory)
                );
            }
        }

        // Validate and filter by price range
        const isMinPriceDefined = minPrice !== null && minPrice !== undefined;
        const isMaxPriceDefined = maxPrice !== null && maxPrice !== undefined;

        if (isMinPriceDefined || isMaxPriceDefined) {
            if (isMinPriceDefined && typeof minPrice !== 'number') {
                throw new Error('Price range values must be numbers.');
            }
            if (isMaxPriceDefined && typeof maxPrice !== 'number') {
                throw new Error('Price range values must be numbers.');
            }

            // Ensure minPrice is not greater than maxPrice, only if both are defined and valid numbers
            if (isMinPriceDefined && isMaxPriceDefined && minPrice > maxPrice) {
                // For a price range, returning an empty array is generally more user-friendly
                // than throwing an error, as it indicates "no results for this range".
                return [];
            }

            results = results.filter(sweet => {
                const passesMin = isMinPriceDefined ? sweet.price >= minPrice : true;
                const passesMax = isMaxPriceDefined ? sweet.price <= maxPrice : true;
                return passesMin && passesMax;
            });
        }

        return results;
    } 

     purchaseSweet(id, quantityToPurchase) {
        // Input validation for ID
        if (typeof id !== 'number' || id <= 0) {
            throw new Error('Sweet ID must be a positive number.');
        }

        // Input validation for quantityToPurchase
        if (typeof quantityToPurchase !== 'number' || quantityToPurchase <= 0) {
            throw new Error('Purchase quantity must be a positive number.');
        }

        const sweet = this.sweets.find(s => s.id === id);

        if (!sweet) {
            throw new Error(`Sweet with ID ${id} not found.`);
        }

        if (sweet.quantity < quantityToPurchase) {
            throw new Error(`Not enough stock for ${sweet.name}. Available: ${sweet.quantity}, Requested: ${quantityToPurchase}.`);
        }

        sweet.quantity -= quantityToPurchase;
        // Return a copy of the updated sweet to prevent direct modification
        return { ...sweet };
    }

    restockSweet(id, quantityToRestock) {
        // Input validation for ID
        if (typeof id !== 'number' || id <= 0) {
            throw new Error('Sweet ID must be a positive number.');
        }

        // Input validation for quantityToRestock
        if (typeof quantityToRestock !== 'number' || quantityToRestock <= 0) {
            throw new Error('Restock quantity must be a positive number.');
        }

        const sweet = this.sweets.find(s => s.id === id);

        if (!sweet) {
            throw new Error(`Sweet with ID ${id} not found.`);
        }

        sweet.quantity += quantityToRestock;
        return { ...sweet }; // Return a copy of the updated sweet
    }
  }

module.exports = SweetShop;
