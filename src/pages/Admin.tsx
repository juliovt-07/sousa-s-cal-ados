import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { saveAs } from 'file-saver';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  isNew: boolean;
  active: boolean;
}

interface Category {
  id: string;
  name: string;
}

const saveProductsToLocalStorage = (products: Product[]) => {
  localStorage.setItem('products', JSON.stringify(products));
};

const getProductsFromLocalStorage = (): Product[] => {
  const productsJson = localStorage.getItem('products');
  return productsJson ? JSON.parse(productsJson) : [];
};

const AdminPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>(getProductsFromLocalStorage());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    price: 0,
    image: '',
    description: '',
    isNew: false,
    active: false,
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [newProductIsNew, setNewProductIsNew] = useState(false);
  const [newProductActive, setNewProductActive] = useState(false);

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleLogin = () => {
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/products.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
      saveProductsToLocalStorage(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Falha ao carregar produtos: ${err.message}`);
      } else {
        setError('Falha ao carregar produtos: erro desconhecido.');
      }
      console.error(err);
    }
    setLoading(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value as string) || 0 : value }));
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedProducts = products.map(p =>
      p.id === editingProduct.id ? { ...p, ...formData } : p
    );

    setProducts(updatedProducts);

    const json = JSON.stringify(updatedProducts, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'products.json');

    saveProductsToLocalStorage(updatedProducts);
    setEditingProduct(null);
    alert('Produto atualizado e arquivo products.json baixado!');
  };

   const isCheckboxInput = (target: EventTarget): target is HTMLInputElement => {
        return (target as HTMLInputElement).type === 'checkbox';
    };

  const handleNewProductChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = isCheckboxInput(e.target) ? (e.target as HTMLInputElement).checked : undefined;
    const newValue = type === 'checkbox' ? checked : value;

    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(newValue as string) || 0 : newValue,
    }));

    if (name === 'isNew') {
      setNewProductIsNew(checked as boolean);
    } else if (name === 'active') {
      setNewProductActive(checked as boolean);
    }
  };

  const handleAddProduct = () => {
    setIsAddingProduct(true);
  };

  const handleCancelAddProduct = () => {
    setIsAddingProduct(false);
    resetNewProductForm();
  };

  const resetNewProductForm = () => {
    setNewProduct({ name: '', category: '', price: 0, image: '', description: '', isNew: false, active: false });
    setNewProductIsNew(false);
    setNewProductActive(false);
  };

  const handleCreateProduct = (e: FormEvent) => {
    e.preventDefault();

    // Generate a new ID based on the last product's ID
    const lastProductId = products.length > 0 ? products[products.length - 1].id : 'p000';
    const newProductId = generateNextProductId(lastProductId);

    const productToAdd: Product = {
      id: newProductId,
      ...newProduct,
      isNew: newProductIsNew,
      active: newProductActive,
    };

    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    saveProductsToLocalStorage(updatedProducts);
    generateProductsFile(updatedProducts);

    setIsAddingProduct(false);
    resetNewProductForm();
    alert('Produto adicionado com sucesso!');
  };

  const generateNextProductId = (lastId: string): string => {
    const numberPart = parseInt(lastId.slice(1), 10);
    const nextNumber = numberPart + 1;
    const nextId = `p${nextNumber.toString().padStart(3, '0')}`;
    return nextId;
  };

  const generateProductsFile = (updatedProducts: Product[]) => {
    const json = JSON.stringify(updatedProducts, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'products.json');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/categories.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Failed to load categories.');
        setCategories([{ id: 'c001', name: 'Erro ao carregar categorias'}]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const storedProducts = getProductsFromLocalStorage();
      if (storedProducts.length > 0) {
        setProducts(storedProducts);
      } else {
        fetchProducts();
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      setFormData({});
    }
  }, [editingProduct]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Administrativo</CardTitle>
            <CardDescription>Por favor, insira a senha para continuar.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">Entrar</Button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Painel de Administração de Produtos</h1>

      {loading && <p>Carregando produtos...</p>}
      {error && !loading && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <Button onClick={handleAddProduct} disabled={isAddingProduct}>
          Adicionar Novo Produto
        </Button>
      </div>

      {isAddingProduct && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Adicionar Novo Produto</CardTitle>
            <CardDescription>Preencha os detalhes do novo produto.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input id="name" name="name" value={newProduct.name} onChange={handleNewProductChange} required />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleNewProductChange}
                  className="w-full border rounded-md py-2 px-3"
                  required
                >
                  <option value="">Selecione a Categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" name="price" type="number" step="0.01" value={newProduct.price} onChange={handleNewProductChange} required />
              </div>
              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input id="image" name="image" value={newProduct.image} onChange={handleNewProductChange} required />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" name="description" value={newProduct.description} onChange={handleNewProductChange} />
              </div>
              <div>
                <Label htmlFor="isNew">É Novo?</Label>
                <input
                  type="checkbox"
                  id="isNew"
                  name="isNew"
                  checked={newProductIsNew}
                  onChange={handleNewProductChange}
                />
              </div>
              <div>
                <Label htmlFor="active">Ativo?</Label>
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={newProductActive}
                  onChange={handleNewProductChange}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Criar Produto</Button>
                <Button type="button" variant="outline" onClick={handleCancelAddProduct}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!editingProduct && !loading && !error && !isAddingProduct && products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
            <CardDescription>Clique em um produto para editar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} onClick={() => setEditingProduct(product)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Editar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {!editingProduct && !loading && !error && products.length === 0 && !isAddingProduct && (
        <p>Nenhum produto encontrado.</p>
      )}

      {editingProduct && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Editando: {editingProduct.name}</CardTitle>
            <CardDescription>Modifique os campos abaixo e clique em salvar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" name="price" type="number" step="0.01" value={formData.price || 0} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input id="image" name="image" value={formData.image || ''} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3"
                  required
                >
                  <option value="">Selecione a Categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Salvar Alterações</Button>
                <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPage;

