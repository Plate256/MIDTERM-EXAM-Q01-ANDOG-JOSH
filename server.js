const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

const inventory = [
    { id: 1, product_name: 'Pencils', category: 'Stationery', price: 10.99, stock: 100 },
    { id: 2, product_name: 'Paper', category: 'Stationery', price: 12.99, stock: 50 },
    { id: 3, product_name: 'Eraser', category: 'Stationery', price: 19.99, stock: 75 }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Main.html'));
});

app.get('/api/inventory', (req, res) => {
    res.json(inventory);
});

app.get('/api/inventory/:id', (req, res) => {
    const item = inventory.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Not Found' });
    res.json(item);
});

app.post('/api/inventory', (req, res) => {
    const { product_name, category, price, stock } = req.body;

    if (stock === undefined || stock === null || Number(stock) < 0) {
        return res.status(400).json({ message: 'Stock cannot be negative.' });
    }

    const newItem = {
        id: inventory.length ? inventory[inventory.length - 1].id + 1 : 1,
        product_name,
        category,
        price: Number(price),
        stock: Number(stock)
    };

    inventory.push(newItem);
    res.status(201).json(newItem);
});

app.delete('/api/inventory/:id', (req, res) => {
    const itemNumber = inventory.findIndex(i => i.id === parseInt(req.params.id));
    if (itemNumber === -1) return res.status(404).json({ message: 'Not Found' });

    const deleted = inventory.splice(itemNumber, 1)[0];
    res.json(deleted);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
