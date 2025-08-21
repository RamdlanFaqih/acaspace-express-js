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

export interface ProductList{
    rows: Product[]
    total: number
}

export const ProductModel = {
    // PROMISE
    // GET ALL PRODUCTS / READ
    getAll: (page: number, pageSize: number, search?: string): Promise<ProductList> => {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * pageSize;

            let query = 'SELECT * FROM products';
            let countQuery = 'SELECT COUNT(*) FROM products';
            const values = [];
            if (search) {
                query += " WHERE name ILIKE $1";
                countQuery += " WHERE name ILIKE $1";
                values.push(`%${search}%`)
                // values = [`%${search}%`]
                // length 1
            }

             // values = []
            //  length = 0
            query += ` ORDER BY id ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
            // kalo ada search
            // query += ` ORDER BY id ASC LIMIT $2 OFFSET $3`,
            // kalo tidak ada search
            // query += ` ORDER BY id ASC LIMIT $1 OFFSET $2`,
            values.push(pageSize, offset)

            db.query(query, values, (err, result) => {
                console.log
                if (err) {
                    reject(err)
                }
                db.query(countQuery, search ? [`%${search}%`] : [], (countErr, countResult) => {
                    if(countErr) {
                        return reject(countErr)
                    }
                    const total = parseInt(countResult.rows[0].count)
                    resolve({rows: result.rows, total})
                })
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