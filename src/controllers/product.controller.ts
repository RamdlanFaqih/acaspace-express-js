import {Request, Response} from "express"
import {ProductModel} from '../models/product.model'


export const getProducts = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string | undefined;
        // nomor halaman
        const page = parseInt(req.query.page as string) || 1;

        // limit
        const pageSize = parseInt(req.query.pageSize as string) || 5

        console.log("search", search)
        const {rows, total} = await ProductModel.getAll(page, pageSize, search);
        const totalPages = Math.ceil(total / pageSize)

        res.status(200).json({
            page: page,
            pageSize: pageSize,
            total,
            totalPages,
            results: rows,
        })
    } catch (err) {
        res.status(500).json({message: "Error Get Products", err})
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({message: "Wajib ada ID"})
        }
        const id = parseInt(req.params.id)
        const product = await ProductModel.getById(id)

        if (!product) {
            return res.status(404).json({message: "Product Not Found"})
        }

        res.status(200).json({
            message: "Get Product Succesfully",
            results: product
        })
    } catch (err) {
        res.status(500).json({message: "Error Get Product", err})
    }
}


export const addProduct = async (req: Request, res: Response) => {
    try {
        const newProduct = await ProductModel.create(req.body)
        res.status(201).json({
            statusCode: 201,
            message: "Product Created Successfully",
            results: newProduct
        })
    } catch (err) {
         res.status(500).json({error: "Error Create Products", message: err})
    }
}

export const editProduct = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({message: "Wajib ada ID"})
        }
        const id = parseInt(req.params.id)
        const updatedProduct = await ProductModel.updateProduct(id, req.body)
        res.status(201).json({
            statusCode: 201,
            message: "Data Updated Successfully",
            results: updatedProduct
        })

    } catch (err) {
         res.status(500).json({error: "Error Update Products", message: err})
    }
}


export const deleteProduct = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({message: "Wajib ada ID"})
        }
        const id = parseInt(req.params.id)
        const deleted = await ProductModel.deleteProduct(id)

        res.status(200).json({
            message: "Product Deleted Succesfully",
            data: deleted,
        })
    } catch (err) {
        res.status(500).json({message: "Error Get Product", err})
    }
}