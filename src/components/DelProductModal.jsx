import { useState, useRef, useEffect } from 'react'
import { Modal } from 'bootstrap';
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DelProductModal({tempProduct, isDelOpen, setIsDelOpen, getProducts}){
    const delProductModalRef = useRef(null);
    const [modalDelData, setModalDelData] = useState(tempProduct)

    useEffect(() => {
        new Modal(delProductModalRef.current, {
        backdrop: false
        });
    }, []);    
    
    useEffect(()=>{
        if(isDelOpen===true){
            const modalInstance = Modal.getInstance(delProductModalRef.current);
            modalInstance.show();
        }
    },[isDelOpen]);

    useEffect(()=>{
        setModalDelData({
            ...tempProduct
        });
    }, [tempProduct])

    const handleCloseDelProductModal = () => {
        const modalInstance = Modal.getInstance(delProductModalRef.current);
        modalInstance.hide();
        setIsDelOpen(false);
    };

    const handleDeleteProduct = () => {
        deleteProduct();
        handleCloseDelProductModal();
    }

    const deleteProduct = async () => {
        try {
            const delRes = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${modalDelData.id}`);
            getProducts();
        } catch (error) {
            alert("刪除失敗");
        }
    };

    return (
        <div
            className="modal fade"
            ref={delProductModalRef}
            id="delProductModal"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">刪除產品</h1>
                        <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={handleCloseDelProductModal}
                        ></button>
                    </div>
                    <div className="modal-body">
                        你是否要刪除 
                        <span className="text-danger fw-bold">{modalDelData.title}</span>
                    </div>
                    <div className="modal-footer">
                        <button
                        type="button"
                        onClick={handleCloseDelProductModal}
                        className="btn btn-secondary"
                        >
                        取消
                        </button>
                        <button type="button" onClick={handleDeleteProduct} className="btn btn-danger">
                        刪除
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DelProductModal;