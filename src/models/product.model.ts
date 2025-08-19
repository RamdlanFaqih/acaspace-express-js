import { db } from "../config/db";

export interface Product {
    id?: number
    discount: string
    name: string
    current_price: number
    image: string
    original_price: number
    savings: number
}

export const ProductModel = {
    // PROMISE
    // GET ALL PRODUCTS / READ
    getAll: (search?: string): Promise<Product[]> => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM products';
            const values = [];
            if (search) {
                query += " WHERE name ILIKE $1";
                values.push(`%${search}%`)
            }
            console.log("query", query)
            console.log("values", values)
            db.query(query, values, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result.rows)
            })
        })
    },

    // GET BY ID
    getById: (id: number): Promise<Product> => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM products WHERE id = $1`, [id], (err, result) => {
                if(err) {
                    reject(err)
                }
                resolve(result.rows[0])
            })
        })
    },

    // CREATE
    create: (product: Product): Promise<Product | null> => {
        const { current_price, discount, image, name, original_price, savings } = product
        return new Promise((resolve, reject) => {
            if (
                !current_price || 
                !image ||
                !name ||
                !original_price ||
                !savings
            ) {
                reject("Gak Boleh Kosong")
            } 
            db.query(
                `INSERT INTO products (name, discount, current_price, image, original_price, savings)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [name, discount, current_price, image, original_price, savings],
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result.rows[0])
                }
            )
        })
    },

    // UPDATE
    // PUT: Update semua isi data dari sebuah product
    updateProduct: (id: number, product: Product): Promise<Product> => {
        return new Promise((resolve, reject) => {
            const { current_price, discount, image, name, original_price, savings } = product
            db.query(
                `UPDATE products
                 SET name = $1, discount = $2, current_price = $3, image = $4, original_price = $5, savings = $6
                 WHERE id = $7`,
                 [name, discount, current_price, image, original_price, savings, id],
                 (err, result) => {
                       if (err) {
                        reject(err)
                    }
                    resolve(result.rows[0])
                 }
            )
        })
    },

     deleteProduct: (id: number): Promise<Product> => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM products WHERE id = $1 RETURNING *`, [id], (err, result) => {
                if(err) {
                    reject(err)
                }
                resolve(result.rows[0])
            })
        })
    },

    // PATCH: Update sebagian / dynamic
}