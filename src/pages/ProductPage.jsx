import { useState, useEffect } from 'react'
import axios from 'axios'
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import DelProductModal from '../components/DelProductModal';
import Toast from '../components/Toast';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductPage({setIsAuth}){
    const [products, setProducts] = useState([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);
    const defaultModalState = {
        imageUrl: "",
        title: "",
        category: "",
        unit: "",
        origin_price: "",
        price: "",
        description: "",
        content: "",
        is_enabled: 0,
        imagesUrl: [""]
    };

    useEffect(() => {
        const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
        );
        axios.defaults.headers.common['Authorization'] = token;
        getProducts();
    }, []);

    const getProducts = async (page = 1) => {
        try {
            const resProduct = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`);
            
            setProducts(resProduct.data.products);
            setPageInfo(resProduct.data.pagination)
        } catch (error) {
            alert("取得資料失敗: ", error);
        }
    };


    const handleLogout = async () => {
        try {
            await axios.post(`${BASE_URL}/v2/logout`);
            setIsAuth(false);
        } catch (error) {
            alert("登出失敗: ", error);
        }
    };

    const [modalMode, setModalMode] = useState(null);
    const [tempProduct, setTempProduct] = useState(defaultModalState);
    const [pageInfo, setPageInfo] = useState({})

    const handlePageChange = (page) => {
        getProducts(page);
    }

    const handleOpenProductModal = (mode, product) => {
        setModalMode(mode);
        setTempProduct(product);
        setIsProductModalOpen(true);
    };

    const handleOpenDelProductModal = (product) => {
        setTempProduct({
            ...product
        })
        setIsDelProductModalOpen(true);
    };

    return (
        <>
            <div className="container">
                <div className="row mb-3 mt-5">
                    <div className="justify-content-end">
                        <button type="button" onClick={handleLogout} className="btn btn-secondary">
                        登出
                        </button>
                    </div>      
                </div>
                <div className="text-end d-flex justify-content-between">
                <h2>產品列表</h2>
                <button className="btn btn-primary" onClick={() => handleOpenProductModal('create', defaultModalState)}>建立新的產品</button>
                </div>
                <table className="table mt-4">
                <thead>
                    <tr>
                        <th scope="col">產品名稱</th>
                        <th scope="col">原價</th>
                        <th scope="col">售價</th>
                        <th scope="col">是否啟用</th>
                        <th scope="col">編輯</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product) => {
                    return (
                        <tr key={product.id}>
                            <td>{product.title}</td>
                            <td>{product.origin_price}</td>
                            <td>{product.price}</td>
                            <td>{product.is_enabled ? (<span className="text-success">啟用</span>) : (<span>未啟用</span>)}</td>
                            <td><button type="button" onClick={() => handleOpenProductModal('edit', product)} className="btn btn-outline-primary me-2">編輯</button><button type="button" onClick={()=>handleOpenDelProductModal(product)} className="btn btn-outline-danger">刪除</button></td>
                        </tr>
                    )
                    })}
                </tbody>
                </table>

                <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
            </div>
        
            <ProductModal 
                modalMode={modalMode} 
                tempProduct={tempProduct} 
                isOpen={isProductModalOpen} 
                setIsOpen={setIsProductModalOpen}
                getProducts={getProducts}
            />

            <DelProductModal 
                tempProduct={tempProduct} 
                isDelOpen={isDelProductModalOpen} 
                setIsDelOpen={setIsDelProductModalOpen}
                getProducts={getProducts}
            />

            <Toast />
        </>

    )
}

export default ProductPage;