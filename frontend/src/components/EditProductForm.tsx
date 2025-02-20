import { useForm, SubmitHandler } from 'react-hook-form';
import { updateProduct } from '../api/products';
import { useMutation } from '@tanstack/react-query';
import { Button, Fieldset, Input, Stack, Textarea } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { HiUpload } from 'react-icons/hi';
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import { useEffect } from 'react';

interface IFormInput {
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  partNumber: string;
  imageUrl?: FileList;
}

interface EditProductFormProps {
  product: IFormInput & { id: number };
  onClose: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      discountedPrice: product.discountedPrice,
      partNumber: product.partNumber,
    },
  });

  useEffect(() => {
    if (product) {
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('discountedPrice', product.discountedPrice || 0);
      setValue('partNumber', product.partNumber);
    }
  }, [product, setValue]);
  
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: IFormInput) => {
      const formData = new FormData();
      (Object.keys(data) as (keyof IFormInput)[]).forEach((key) => {
        if (key === 'imageUrl' && data[key]?.[0]) {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, key === 'price' || key === 'discountedPrice' ? String(data[key]) : data[key] as string | Blob);
        }
      });

      return updateProduct(product.id, formData);
    },
    onSuccess: () => {
      onClose();
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    mutate(data);
  };

  return (
    <Fieldset.Root size="lg" maxW="md" mx="auto" p={6} borderRadius="lg">
      <Stack>
        <Fieldset.Legend>Edit Product</Fieldset.Legend>
        <Fieldset.HelperText>
          Update the product information below.
        </Fieldset.HelperText>
      </Stack>

      <Fieldset.Content mt={4}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Field
              label="Name"
              invalid={!!errors.name}
              errorText={errors.name?.message?.toString()}
            >
              <Input
                {...register('name', { required: 'Name is required' })}
                placeholder="Name"
              />
            </Field>

            <Field
              label="Description"
              invalid={!!errors.description}
              errorText={errors.description?.message?.toString()}
            >
              <Textarea
                {...register('description', {
                  required: 'Description is required',
                })}
                placeholder="Description"
              />
            </Field>

            <Field
              label="Price"
              invalid={!!errors.price}
              errorText={errors.price?.message?.toString()}
            >
              <Input
                {...register('price', {
                  required: 'Price is required',
                  valueAsNumber: true,
                })}
                placeholder="Price"
                type="number"
                step="0.01"
              />
            </Field>

            <Field
              label="Discounted Price"
              invalid={!!errors.discountedPrice}
              errorText={errors.discountedPrice?.message?.toString()}
            >
              <Input
                {...register('discountedPrice', {
                  valueAsNumber: true,
                })}
                placeholder="Discounted Price"
                type="number"
                step="0.01"
              />
            </Field>

            <Field
              label="Part Number"
              invalid={!!errors.partNumber}
              errorText={errors.partNumber?.message?.toString()}
            >
              <Input
                {...register('partNumber', {
                  required: 'Part Number is required',
                })}
                placeholder="Part Number"
              />
            </Field>

            <Field label="Image">
              <FileUploadRoot {...register('imageUrl')}>
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm">
                    <HiUpload /> Upload Product Image
                  </Button>
                </FileUploadTrigger>
                <FileUploadList />
              </FileUploadRoot>
            </Field>

            <Stack direction="row" justifyContent="space-between" mt={4}>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </form>
      </Fieldset.Content>
    </Fieldset.Root>
  );
};

export default EditProductForm;