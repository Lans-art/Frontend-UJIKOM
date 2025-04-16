import axiosInstance from '../../axios'; // Adjust the import path as needed
import { endpoints } from '../../axios';

// Get all accounts
export const getAccounts = async () => {
  try {
    const response = await axiosInstance.get(endpoints.crudAcccount.list);
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

export const getAccountById = async (id) => {
  try {
    console.log("API call for account ID:", id);
    
    // Gunakan template string dengan backtick (``)
    const response = await axiosInstance.get(`${endpoints.detail.detailAccount}/${id}`);
    
    // axios tidak menggunakan response.ok, jadi kita periksa response status di catch jika error
    const data = response.data;
    
    console.log("API returned data:", data);
    return data;
  } catch (error) {
    console.error("Error in getAccountById:", error);
    throw error;
  }
};

// Create new account
export const createAccount = async (formData) => {
  try {
    const response = await axiosInstance.post(endpoints.crudAcccount.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for handling file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

// Update account
export const updateAccount = async (id, formData) => {
  try {
    // For method PUT, many APIs require _method=PUT in the formData when using multipart/form-data
    formData.append('_method', 'PUT');
    
    const response = await axiosInstance.post(endpoints.crudAcccount.update(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for handling file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating account ${id}:`, error);
    throw error;
  }
};

// Delete account
export const deleteAccount = async (id) => {
  try {
    const response = await axiosInstance.delete(endpoints.crudAcccount.delete(id));
    return response.data;
  } catch (error) {
    console.error(`Error deleting account ${id}:`, error);
    throw error;
  }
};

export const checkForDuplicates = async (game, game_email, game_password, currentId = null) => {
  try {
    // Get all accounts (tanpa filter game)
    const response = await axiosInstance.get(endpoints.crudAcccount.list);

    // Cari akun yang game-nya sama DAN email + password-nya sama
    const duplicate = response.data.find(account => 
      account.game === game &&
      account.game_email === game_email &&
      account.game_password === game_password &&
      (currentId === null || account.id !== currentId) // Kalau lagi edit, skip data sendiri
    );

    return !!duplicate;
  } catch (error) {
    console.error("Error checking for duplicates:", error);
    throw error;
  }
};



// Get accounts for public display (might filter out some sensitive data)
export const getPublicAccounts = async (gameFilter = null) => {
  try {
    const params = {};
    if (gameFilter && gameFilter !== 'all') {
      params.game = gameFilter;
    }
    
    const response = await axiosInstance.get(endpoints.crudAcccount.list, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching public accounts:", error);
    throw error;
  }
};