import { useState, useRef, useEffect } from 'react'
import { Modal } from 'bootstrap';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({modalMode, tempProduct, isOpen, setIsOpen, getProducts}){
    const [modalData, setModalData] = useState(tempProduct)
    const [tempImage, setTempImage] = useState("");
    const productModalRef = useRef(null);

    useEffect(() => {
        new Modal(productModalRef.current, {
        backdrop: false
        });
    }, []);

    useEffect(()=>{
        if(isOpen){
            const modalInstance = Modal.getInstance(productModalRef.current);
            modalInstance.show();
        }
    },[isOpen])

    const dispatch = useDispatch();

    useEffect(()=>{
        setModalData({
            ...tempProduct
        });
    }, [tempProduct])

    const handleCloseProductModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.hide();
        setIsOpen(false);
    };

    const handleImageChange = (e, index) => {
        const { value } = e.target;
        const newImages = [...modalData.imagesUrl];
        newImages[index] = value;

        setModalData({
        ...modalData,
        imagesUrl: newImages.filter(image => image != "")
        })
    };

    const handleTempImageChange = (e) => {
        setTempImage(e.target.value);
    };

    const handleModalInputChange = (e) => {
        const { value, name, checked, type } = e.target;
        setModalData({
        ...modalData,
        [name]: type === "checkbox" ? checked : value
        })
    };

    const handleAddImage = () => {
        const newImages = [...modalData.imagesUrl];
        newImages[newImages.filter(image => image != "").length] = tempImage;

        setModalData({
        ...modalData,
        imagesUrl: newImages
        })
        setTempImage("");
    };

    const handleDeleteImage = () => {
        let newImages = [...modalData.imagesUrl];
        newImages = newImages.filter(image => image != "").slice(0, -1);

        setModalData({
        ...modalData,
        imagesUrl: newImages
        })
    };

    const createProduct = async () => {
        const createProduct = {
        ...modalData,
        origin_price: Number(modalData.origin_price),
        price: Number(modalData.price),
        is_enabled: modalData.is_enabled ? 1 : 0
        };

        try {
            const resCreate = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
                data: createProduct
            })
            getProducts();
            handleCloseProductModal();

            dispatch(pushMessage({
                text: '建立產品成功',
                status: 'success'
            }))

        } catch (error) {
            handleCloseProductModal();
            const { message } = error.response.data;
            dispatch(pushMessage({
                text: message.join("、"),
                status: 'failed'
            }))
            //alert(error.response.data.message);
        }
    };

    const updateProduct = async () => {
        const updateProduct = {
        ...modalData,
        origin_price: Number(modalData.origin_price),
        price: Number(modalData.price),
        is_enabled: modalData.is_enabled ? 1 : 0
        };

        try {
        const resUpdate = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${modalData.id}`, {
            data: updateProduct
        });
        getProducts();
        handleCloseProductModal();

        dispatch(pushMessage({
            text: '編輯產品成功',
            status: 'success'
        }))

        } catch (error) {
            handleCloseProductModal();
            const { message } = error.response.data;
            dispatch(pushMessage({
                text: message.join("、"),
                status: 'failed'
            }))
        }
    };

    const handleFileChange = async(e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file-to-upload', file);
        
        try{
        const resFile = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData);

        setModalData ({
            ...modalData,
            imageUrl:resFile.data.imageUrl
        }) 
        }catch(error){
            const { message } = error.response.data;
            dispatch(pushMessage({
                text: message.join("、"),
                status: 'failed'
            }))
            console.log("Error: ", error)
        }
    }

    return (
        <div id="productModal" ref={productModalRef} className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow">
                <div className="modal-header border-bottom">
                <h5 className="modal-title fs-4">{modalMode === "create" ? '新增產品' : '編輯產品'}</h5>
                <button type="button" onClick={handleCloseProductModal} className="btn-close" aria-label="Close"></button>
                </div>

                <div className="modal-body p-4">
                <div className="row g-4">
                    <div className="col-md-4">
                    <div className="mb-4">
                        <div className="mb-5">
                        <label htmlFor="fileInput" className="form-label">圖片上傳</label>
                        <input 
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            className='form-control'
                            id='fileInput' 
                            onChange={handleFileChange}
                        />
                        </div>
                        <label htmlFor="primary-image" className="form-label">
                        主圖
                        </label>
                        <div className="input-group">
                        <input
                            value={modalData.imageUrl}
                            onChange={handleModalInputChange}
                            name="imageUrl"
                            type="text"
                            id="primary-image"
                            className="form-control"
                            placeholder="請輸入圖片連結"
                        />
                        </div>
                        <img
                        src={modalData.imageUrl}
                        alt={modalData.title}
                        className="img-fluid"
                        />
                    </div>

                    {/* 副圖 */}
                    <div className="border border-2 border-dashed rounded-3 p-3">
                        {modalData?.imagesUrl?.map((image, index) => (
                        image && (
                            <div key={index} className="mb-2" >
                            <label
                                htmlFor={`imagesUrl-${index + 1}`}
                                className="form-label"
                            >
                                副圖 {index + 1}
                            </label>
                            <input
                                value={image}
                                onChange={(e) => handleImageChange(e, index)}
                                id={`imagesUrl-${index + 1}`}
                                type="text"
                                placeholder={`圖片網址 ${index + 1}`}
                                className="form-control mb-2"
                            />
                            {image && (
                                <img
                                src={image}
                                alt={`副圖 ${index + 1}`}
                                className="img-fluid mb-2"
                                />
                            )}
                            </div>)
                        ))
                        }

                        {
                        modalData?.imagesUrl.filter(image => image != "").length < 5 && (
                            <div className='d-flex flex-column'>
                            <label
                                htmlFor={`imagesUrl-${modalData?.imagesUrl.filter(image => image != "").length + 1}`}
                                className="form-label"
                            >
                                副圖 {modalData?.imagesUrl.filter(image => image != "").length + 1}
                            </label>
                            <input
                                value={tempImage}
                                onChange={(e) => handleTempImageChange(e)}
                                id={`imagesUrl-${modalData?.imagesUrl.filter(image => image != "").length + 1}`}
                                type="text"
                                placeholder={`圖片網址 ${modalData?.imagesUrl.filter(image => image != "").length + 1}`}
                                className="form-control mb-2"
                            />
                            <img
                                src={tempImage}
                                alt={`副圖 ${modalData?.imagesUrl.filter(image => image != "").length + 1}`}
                                className="img-fluid mb-2"
                            />
                            </div>
                        )
                        }
                        <div className='d-flex'>
                        {
                            modalData?.imagesUrl.filter(image => image != "").length < 5 && (
                            <button type="button" onClick={handleAddImage} className="btn btn-outline-primary btn-sm d-block w-100 me-2">
                                新增圖片
                            </button>
                            )
                        }
                        {
                            modalData?.imagesUrl[1] && modalData?.imagesUrl.filter(image => image != "").length > 1 && (<button type="button" onClick={handleDeleteImage} className="btn btn-outline-danger btn-sm d-block w-100">
                            刪除圖片
                            </button>)
                        }
                        </div>
                    </div>
                    </div>

                    <div className="col-md-8">
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                        標題
                        </label>
                        <input
                        value={modalData.title}
                        onChange={handleModalInputChange}
                        name="title"
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">
                        分類
                        </label>
                        <input
                        value={modalData.category}
                        onChange={handleModalInputChange}
                        name="category"
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="unit" className="form-label">
                        單位
                        </label>
                        <input
                        value={modalData.unit}
                        onChange={handleModalInputChange}
                        name="unit"
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        />
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-6">
                        <label htmlFor="origin_price" className="form-label">
                            原價
                        </label>
                        <input
                            value={modalData.origin_price}
                            onChange={handleModalInputChange}
                            name="origin_price"
                            id="origin_price"
                            type="number"
                            min="1"
                            className="form-control"
                            placeholder="請輸入原價"
                        />
                        </div>
                        <div className="col-6">
                        <label htmlFor="price" className="form-label">
                            售價
                        </label>
                        <input
                            value={modalData.price}
                            onChange={handleModalInputChange}
                            name="price"
                            id="price"
                            type="number"
                            min="1"
                            className="form-control"
                            placeholder="請輸入售價"
                        />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                        產品描述
                        </label>
                        <textarea
                        value={modalData.description}
                        onChange={handleModalInputChange}
                        name="description"
                        id="description"
                        className="form-control"
                        rows={4}
                        placeholder="請輸入產品描述"
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">
                        說明內容
                        </label>
                        <textarea
                        value={modalData.content}
                        onChange={handleModalInputChange}
                        name="content"
                        id="content"
                        className="form-control"
                        rows={4}
                        placeholder="請輸入說明內容"
                        ></textarea>
                    </div>

                    <div className="form-check">
                        <input
                        checked={modalData.is_enabled}
                        onChange={handleModalInputChange}
                        name="is_enabled"
                        type="checkbox"
                        className="form-check-input"
                        id="isEnabled"
                        />
                        <label className="form-check-label" htmlFor="isEnabled">
                        是否啟用
                        </label>
                    </div>
                    </div>
                </div>
                </div>

                <div className="modal-footer border-top bg-light">
                <button type="button" onClick={handleCloseProductModal} className="btn btn-secondary">
                    取消
                </button>
                <button type="button" onClick={() => modalMode === "create" ? createProduct() : updateProduct()} className="btn btn-primary">
                    確認
                </button>
                </div>
            </div>
            </div>
        </div >
    )
}

export default ProductModal;