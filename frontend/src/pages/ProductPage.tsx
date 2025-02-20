import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../api/products';
import {
  Box,
  Button,
  Heading,
  Image,
  Skeleton,
  Stack,
  Text,
  Flex,
} from '@chakra-ui/react';
import {
  DialogBody,
  DialogContent,
  DialogRoot,
} from '@/components/ui/dialog';
import EditProductForm from '../components/EditProductForm';
import { useState } from 'react';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
  });

  const [isEditing, setIsEditing] = useState(false);

  if (isLoading)
    return (
      <Box maxW="xl" mx="auto" p={6}>
        <Skeleton height="40px" />
        <Skeleton height="20px" mt={4} />
        <Skeleton height="300px" mt={6} />
      </Box>
    );

  if (error || !product)
    return <Text color="red.500">Failed to load product</Text>;

  const hasDiscount =
    product.discountedPrice && product.discountedPrice < product.price;

  return (
    <Box
      maxW="2xl"
      mx="auto"
      p={6}
      my={5}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Stack>
        <Image
          src={import.meta.env.VITE_API_URL + product.imageUrl}
          alt={product.name}
          borderRadius="lg"
          objectFit="cover"
          maxH="350px"
          mx="auto"
          boxShadow="md"
        />
        <Heading size="xl">{product.name}</Heading>
        <Stack>
          <Flex mt={1} align="center" gap={2}>
            {hasDiscount ? (
              <>
                <Text fontSize="xl" fontWeight="bold">
                  ${product.discountedPrice}
                </Text>
                <Text
                  fontSize="xl"
                  color="gray.500"
                  textDecoration="line-through"
                >
                  ${product.price}
                </Text>
              </>
            ) : (
              <Text fontSize="xl" fontWeight="bold">
                ${product.price}
              </Text>
            )}
          </Flex>
          <Text fontSize="md" color="gray.500">
            {product.description}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Part Number: {product.partNumber}
          </Text>
        </Stack>
        <Button colorScheme="blue" size="lg" onClick={() => setIsEditing(true)}>
          Edit
        </Button>

        {isEditing && (
          <DialogRoot open={isEditing}>
            <DialogContent>
              <DialogBody pb="4">
                <EditProductForm
                  product={product}
                  onClose={() => setIsEditing(false)}
                />
              </DialogBody>
            </DialogContent>
          </DialogRoot>
        )}
      </Stack>
    </Box>
  );
};

export default ProductPage;
