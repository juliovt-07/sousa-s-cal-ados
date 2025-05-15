import fs from 'fs';
import path from 'path';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    stock: number;
}

type Data = {
    message: string;
};

export default async function handler(
    req: any,
    res: any
) {
    if (req.method === 'POST') {
        try {
            const products: Product[] = req.body;
            const filePath = path.join(process.cwd(), 'public/data/products.json');

            fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

            res.status(200).json({ message: 'Products updated successfully' });
        } catch (error) {
            console.error('Error updating products:', error);
            res.status(500).json({ message: 'Failed to update products' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}