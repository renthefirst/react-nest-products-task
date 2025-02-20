import { useForm, SubmitHandler } from 'react-hook-form';
import { createProduct } from '../api/products';
import { Button, Fieldset, Input, Stack, Textarea } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { HiUpload } from 'react-icons/hi';
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from '@/components/ui/file-upload';

interface IFormInput {
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  partNumber: string;
  imageUrl: FileList;
}

const AddProductForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'imageUrl' && data[key][0]) {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });

    await createProduct(formData);
  };

  return (
    <Fieldset.Root
      size="lg"
      maxW="md"
      mx="auto"
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Stack>
        <Fieldset.Legend>Add Product</Fieldset.Legend>
        <Fieldset.HelperText>
          Please provide the product details below.
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
              />
            </Field>

            <Field
              label="Part Number"
              invalid={!!errors.partNumber}
              errorText={errors.partNumber?.message?.toString()?.toString()}
            >
              <Input
                {...register('partNumber', {
                  required: 'Part Number is required',
                })}
                placeholder="Part Number"
              />
            </Field>

            <Field label="Image">
              <FileUploadRoot
                {...register('imageUrl', { required: 'Image is required' })}
              >
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm">
                    <HiUpload /> Upload image of product
                  </Button>
                </FileUploadTrigger>
                <FileUploadList />
              </FileUploadRoot>
            </Field>

            <Button type="submit" colorScheme="green" size="md" mt={4}>
              Add Product
            </Button>
          </Stack>
        </form>
      </Fieldset.Content>
    </Fieldset.Root>
  );
};

export default AddProductForm;