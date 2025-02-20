import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductPage from './pages/ProductPage';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import AddNewProductPage from './pages/AddNewProductPage';

function App() {
  return (
    <Router>
      <Box p={4} boxShadow="md">
        <nav>
          <Flex alignItems="center" justifyContent="space-between">
            <HStack>
              <Link to="/">
                <Button variant="outline">Product Catalog</Button>
              </Link>
              <Link to="/add-product">
                <Button variant="outline">Add New Product</Button>
              </Link>
            </HStack>
          </Flex>
        </nav>
      </Box>

      <Routes>
        <Route path="/" element={<ProductCatalogPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/add-product" element={<AddNewProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
