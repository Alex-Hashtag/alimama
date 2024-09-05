import { useState, useEffect, useCallback } from 'react';
import { Item } from '../types.tsx';
import { jwtDecode } from 'jwt-decode'; // You can use a library like jwt-decode

interface TokenPayload {
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemsChanged, setItemsChanged] = useState(false); // State to track changes

  const getVendorIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);
        console.log('Decoded token:', decoded);
        return decoded.userId;
      } 
      catch (error) {
        console.error('Error decoding token:', error);
      }
    } 
    else {
      console.error('No token found in localStorage');
    }
    return null;
  };
  
  // Check the structure of fetched data
  const fetchItems = useCallback(async () => {
    const vendorId = getVendorIdFromToken();
    if (!vendorId) {
      console.error('No vendorId found in token');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/items/retrieve');
      const data = await response.json();

      console.log("Fetched items:", data); // Log the fetched data to verify

      // Filter the items by vendorId
      const vendorItems = data.filter((item: Item) => item.vendorId === vendorId);
      setItems(vendorItems);
      setItemsChanged(false); // Reset the change flag
    } 
    catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [itemsChanged]);

  const createItem = async (itemData: Partial<Item>) => {
    const token = localStorage.getItem('authToken'); 
    if (!token) {
      console.error('No token found');
      return;
    }
  
    const decoded: TokenPayload = jwtDecode(token);
    const vendorId = decoded.userId; // Get vendorId from the token
  
    try {
      const response = await fetch('http://localhost:8080/api/items/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...itemData, vendorId }), // attach vendorId to the item data
      });
  
      if (response.ok) {
        setItemsChanged(true); // Set flag to true to trigger fetchItems
      } 
      else {
        const errorText = await response.text();
        console.error(`Error creating item: ${errorText}`);
      }
    } 
    catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const updateItem = async (itemData: Partial<Item>) => {
    try {
      const id = itemData._id && typeof itemData._id === 'object' ? String(itemData._id) : itemData._id;
  
      if (!id || typeof id !== 'string' || id.length !== 24) {
        console.error('Invalid _id format.');
        return;
      }
  
      const updatedFields = {
        ...(itemData.productName && { productName: itemData.productName }),
        ...(itemData.numInStock && { numInStock: itemData.numInStock }),
        ...(itemData.price && { price: itemData.price }),
        ...(itemData.tags && { tags: itemData.tags }),
        ...(itemData.pictures && { pictures: itemData.pictures }),
        ...(itemData.ratingAvgTotal && { ratingAvgTotal: itemData.ratingAvgTotal }),
      };
  
      const response = await fetch(`http://localhost:8080/api/items/modify/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),  // Send the updatedFields directly
      });
  
      if (response.ok) {
        setItemsChanged(true); // Set flag to true to trigger fetchItems
      } 
      else {
        const errorText = await response.text();
        console.error(`Error updating item: ${errorText}`);
      }
    } 
    catch (error) {
      console.error('Error updating item:', error);
    }
  };
  
  
  const deleteItem = async (id: string) => {
    try {
        if (typeof id === 'string' && id.trim() !== '') {
            const response = await fetch(`http://localhost:8080/api/items/delete/${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                fetchItems(); // Refresh the list after successful deletion
            } else {
                console.error('Error deleting item:', await response.text());
            }
        } else {
            console.error('Invalid ID format:', id);
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, createItem, updateItem, deleteItem };
};
