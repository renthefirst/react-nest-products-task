import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import {
  Box,
  Grid,
  GridItem,
  HStack,
  Spinner,
  Text,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { IProduct } from '@/types/Product';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const ProductCatalogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', currentPage, 'price', order, debouncedSearch],
    queryFn: () =>
      fetchProducts({
        page: currentPage,
        limit: pageSize,
        sort: 'price',
        order,
        search: debouncedSearch,
      }),
  });

  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    if (data) {
      setProducts(data.products);
    }
  }, [data]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteProduct = useCallback(
    (productId: IProduct['id']) => {
      setProducts(products.filter((product) => product.id !== productId));
    },
    [products]
  );

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" color="red.500" alignItems="center">
        <Text fontSize="lg">Error loading products</Text>
      </Box>
    );

  return (
    <Box>
      <HStack p={5}>
        <Input
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as 'ASC' | 'DESC')}
        >
          <option value="ASC">Lower priced</option>
          <option value="DESC"> Higher priced</option>
        </select>
      </HStack>

      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)',
        }}
        gap={5}
        p={6}
      >
        {products.map((product) => (
          <GridItem key={product.id}>
            <ProductCard product={product} onDelete={handleDeleteProduct} />
          </GridItem>
        ))}
      </Grid>

      <HStack justifyContent="center" mt={4}>
        <IconButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!data?.previous}
          variant="plain"
        >
          <GrFormPrevious />
        </IconButton>
        <Text> {currentPage}</Text>
        <IconButton
          variant="plain"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!data?.next}
        >
          <GrFormNext />
        </IconButton>
      </HStack>
    </Box>
  );
};

export default ProductCatalogPage;
