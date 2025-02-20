import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/products'

interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
}

export const fetchProducts = async (params: PaginationParams) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        sort: params.sort || 'name',
        order: params.order || 'ASC',
        search: params.search || '',
      },
    });

    return response.data;
  } catch {
    throw new Error('Failed to fetch products');
  }
};

export const fetchProduct = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await axios.post(API_URL, product, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await axios.put(`${API_URL}/${id}`, product, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
