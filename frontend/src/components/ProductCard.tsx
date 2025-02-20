import { deleteProduct } from '@/api/products';
import { IProduct } from '@/types/Product';
import { Box, IconButton, Image, Text, Flex } from '@chakra-ui/react';
import { memo } from 'react';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: IProduct;
  onDelete: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const router = useNavigate();
  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      onDelete(product.id);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const hasDiscount =
    product.discountedPrice && product.discountedPrice < product.price;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      width="100%"
      maxW={{ base: '190px', sm: '250px', md: '350px' }}
      h={{ base: '550px', md: '450px' }}
      display="flex"
      flexDirection="column"
      _hover={{ scale: '1.04' }}
      transition="scale 0.2s ease-in-out"
    >
      <Flex justify="center" align="center" p={4}>
        <Box w="220px" position="relative">
          <Image
            src={import.meta.env.VITE_API_URL + product.imageUrl}
            alt={product.name}
            width="220px"
            height="220px"
            objectFit="cover"
            borderRadius="lg"
            onClick={() => router(`/products/${product.id}`)}
            _hover={{ cursor: 'pointer' }}
          />
          <IconButton
            variant="plain"
            color="red"
            size={'md'}
            onClick={handleDelete}
            aria-label="Delete product"
            position="absolute"
            top={0}
            right={0}
            _hover={{ opacity: 0.6 }}
            zIndex={100}
          >
            <MdDelete />
          </IconButton>
        </Box>
      </Flex>

      <Flex flex="1" flexDirection="column" justify="space-between" p={4}>
        <Box>
          <Text fontWeight="bold" fontSize="lg">
            {product.name.length > 17
              ? product.name.substring(0, 17) + '...'
              : product.name}
          </Text>
          <Flex mt={1} align="center" gap={2}>
            {hasDiscount ? (
              <>
                <Text fontSize="sm" fontWeight="bold">
                  ${product.discountedPrice}
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  textDecoration="line-through"
                >
                  ${product.price}
                </Text>
              </>
            ) : (
              <Text fontSize="lg">${product.price}</Text>
            )}
          </Flex>

          <Text fontSize="sm" color="gray.600">
            {product.description}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default memo(ProductCard);
