import axios from "axios";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Footer from "./Footer";

function Edit() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [typeRooms, setTypeRooms] = useState([]);
    const params = useParams();
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');
    const role = sessionStorage.getItem('role');
    const idAccount = sessionStorage.getItem('account_id');

    // Fetch type rooms data
    useEffect(() => {
        async function getTypeRooms() {
            try {
                const response = await axios.get("http://localhost:8080/api/type-room");
                setTypeRooms(response.data);
            } catch (error) {
                console.error("Error fetching type rooms:", error);
            }
        }

        getTypeRooms();
    }, []);

    // Fetch existing data for editing
    useEffect(() => {
        async function getExistingData() {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/house/${params.id}`
                );
                const existingData = response.data;
                // Set the form values for editing
                formEdit.setValues({
                    name: existingData.name,
                    address: existingData.address,
                    description: existingData.description,
                    price: existingData.price,
                    numberOfBedRoom: existingData.numberOfBedRoom,
                    numberOfBathRoom: existingData.numberOfBathRoom,
                    accountId: existingData.accountId,
                    rooms: existingData.rooms.map((room) => ({
                        name: room.name,
                        typeId: room.typeRoom.id,
                    })),
                });
            } catch (error) {
                console.error("Error fetching existing data:", error);
            }
        }

        getExistingData();
    }, [params.id]);

    // Form submission logic using Formik
    const formEdit = useFormik({
        initialValues: {
            name: "",
            address: "",
            description: "",
            price: "",
            numberOfBedRoom: "",
            numberOfBathRoom: "",
            accountId: idAccount, // Set default accountId or handle dynamically
            rooms: [{ name: "", typeId: "" }],
        },
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("address", values.address);
                formData.append("description", values.description);
                formData.append("price", values.price);
                formData.append("numberOfBedRoom", values.numberOfBedRoom);
                formData.append("numberOfBathRoom", values.numberOfBathRoom);

                values.rooms.forEach((room, index) => {
                    formData.append(`rooms[${index}].name`, room.name);
                    formData.append(`rooms[${index}].typeId`, room.typeId);
                });

                formData.append("image", image);

                await axios.put(
                    `http://localhost:8080/api/house/${params.id}`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                // Navigate to home page after successful submission
                navigate("/home");
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        },
    });

    // Handle image change
    function handleImageChange(e) {
        const file = e.target.files[0];
        setImage(file);
    }



    return (
        <div>
            <div className="header" style={{ position: "sticky", top: "0", zIndex: "1000" }}>
                <nav className="navbar navbar-expand-lg bg-white shadow-sm">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/home">
                            <img src="https://banner2.cleanpng.com/20181122/xfy/kisspng-logo-house-renting-home-housing-5bf774850ed024.2354280415429438770607.jpg" alt="Agoda" style={{ height: "30px" }} />
                        </a>
                        <a className="nav-link active" aria-current="page" href="/home">Trang chủ</a>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                            <ul className="navbar-nav">
                                {role === 'admin' || role === 'host' ? (
                                    <>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                {username}
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a className="dropdown-item" href="/host">Chủ nhà</a></li>
                                                <li><a className="dropdown-item" href="/create">Đăng nhà</a></li>
                                                <li><a href={`/history/${idAccount}`} className="dropdown-item">Lịch sử đặt</a></li>
                                                <li><a className="dropdown-item" href="#">Chi tiết tài khoản</a></li>
                                            </ul>
                                        </li>
                                    </>
                                ) : (
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {username}
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li><a href={`/history/${idAccount}`} className="dropdown-item">Lịch sử đặt</a></li>
                                            <li><a className="dropdown-item" href="#">Chi tiết tài khoản</a></li>
                                        </ul>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div className="container w-50" style={{ alignContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <h1>
                        Sửa thông tin nhà đang cho thuê
                    </h1>
                </div>
                <form className="row g-3" onSubmit={formEdit.handleSubmit}>
                    <div className="col-md">
                        <label htmlFor="inputName" className="form-label">Tên nhà</label>
                        <input type="text" className="form-control" name="name" id="name"
                            value={formEdit.values.name}
                            onChange={formEdit.handleChange} />
                    </div>
                    <div className="col-12">
                        <label htmlFor="address" className="form-label">Địa chỉ</label>
                        <input type="text" className="form-control" id="address" name="address"
                            value={formEdit.values.address}
                            onChange={formEdit.handleChange} placeholder="1234 Main St" />
                    </div>
                    <div className="input-group">
                        <span className="input-group-text">Số phòng ngủ</span>
                        <input type="number" aria-label="numberOfBedRoom" id="numberOfBedRoom" name="numberOfBedRoom"
                            className="form-control" onChange={formEdit.handleChange}
                            value={formEdit.values.numberOfBedRoom}
                            placeholder="Phòng ngủ" />

                    </div>
                    <div className="input-group">
                        <span className="input-group-text">Số phòng tắm</span>

                        <input type="number" aria-label="numberOfBathRoom" id="numberOfBathRoom" name="numberOfBathRoom"
                            className="form-control" onChange={formEdit.handleChange}
                            value={formEdit.values.numberOfBathRoom}
                            placeholder="Phòng tắm" />
                    </div>
                    <div className="mb-3">
                        <label for="formFileMultiple" className="form-label">Thêm ảnh</label>
                        <input className="form-control" name="image" onChange={handleImageChange} type="file"
                            id="formFileMultiple" multiple />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Giá</span>
                        <input type="text" className="form-control" id="price" name="price"
                            value={formEdit.values.price}
                            onChange={formEdit.handleChange} aria-label="Amount (to the nearest dollar)" />
                        <span className="input-group-text">.00</span>
                    </div>
                    {formEdit.values.rooms.map((room, index) => (

                        <div key={index} className="row g-2">
                            <div className="col-md">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={room.name}
                                        name={`rooms[${index}].name`}
                                        id={`room.name-${index}`}
                                        placeholder="Tên phòng"
                                        onChange={formEdit.handleChange}
                                    />
                                    <label htmlFor={`room.name-${index}`}>Tên phòng</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <div className="form-floating">
                                    <select
                                        className="form-select"
                                        name={`rooms[${index}].typeId`}
                                        value={room.typeId}
                                        id={`rooms.typeId-${index}`}
                                        onChange={formEdit.handleChange}
                                    >
                                        <option selected>Loại phòng</option>
                                        {typeRooms.map((typeRoom) => (
                                            <option key={typeRoom.id} value={typeRoom.id}>
                                                {typeRoom.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor={`rooms.typeId-${index}`}>Chọn loại phòng</label>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="form-floating">
                        <textarea className="form-control" placeholder="Leave a comment here" name="description"
                            id="description" onChange={formEdit.handleChange}
                            value={formEdit.values.description}
                            style={{ height: "100px" }}></textarea>
                        <label for="floatingTextarea2">Mô tả</label>
                    </div>

                    <div className="col-12">
                        <Link to={"/host"}>
                            <button className="btn btn-outline-secondary"
                                style={{ color: "black", marginRight: "1%" }}>Hủy
                            </button>
                        </Link>
                        <button type="submit" className="btn btn-outline-primary">Sửa nhà</button>
                    </div>
                </form>
            </div>
            <div className="footer">
                <Footer />
            </div>
        </div>
    )
}


export default Edit;
