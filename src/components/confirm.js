import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { set } from "date-fns";
import Footer from "./Footer";
import "../css/confirm.css"

function Confirm() {

    const navigate = useNavigate();

    const [orders, setOrder] = useState([]);
    const [getid, setid] = useState('');

    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');
    const role = sessionStorage.getItem('role');
    const idAccount = sessionStorage.getItem('account_id');
    const [isHidden, setIsHidden] = useState(false)
    // const [search, setSearch] = useState('');


    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPage, setItemsPage] = useState(10);
    const totalPages = Math.ceil(orders.length / itemsPage);

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPage;
        const endIndex = startIndex + itemsPage;
        return orders.slice(startIndex, endIndex);
    };


    const currentPageData = getCurrentPageData();


    const renderPageItems = () => {
        const pageItems = [];
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === currentPage ? 'active' : '';
            pageItems.push(
                <li className={`page-item ${isActive}`} key={i}>
                    <a className="page-link" onClick={() => currentPage + 1}>{i}</a>
                </li>
            );
        }
        return pageItems;
    };


    async function getOrder() {
        const res = await axios.get(`http://localhost:8080/api/order/host/${idAccount}`);
        setOrder(res.data);
    };


    useEffect(() => {
        getOrder();

    }, [])

    async function yes(order) {
        const response = await axios.put(`http://localhost:8080/api/order/yes/${idAccount}`, {
            total: "1",
            id: order.id
        });
        getOrder()
    }

    async function no(order) {
        const response = await axios.put(`http://localhost:8080/api/order/yes/${idAccount}`, {
            total: "2",
            id: order.id
        });
        getOrder()
    }

    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    return (
        <>
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
                <body>
                    <div className="container">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class="nav-link " href="/host">Danh sách nhà cho thuê</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href={`/order/${idAccount}`}>Danh sách đăng ký thuê</a>
                            </li>
                        </ul>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tên người đặt</th>
                                    <th>Tên nhà</th>
                                    <th>Địa chỉ</th>
                                    <th>Giá</th>
                                    <th>Chức năng</th>
                                </tr>
                            </thead>
                            {orders.reverse().map((order, i) => (
                                <tbody key={i}>
                                    {order.status.id === 3 && (
                                        <tr>
                                            <td scope="row">{i + 1}</td>
                                            <td>{order.account.name}</td>
                                            <td>
                                                <a href={`detail/${order.house.id}`} className="custom-link">
                                                    {order.house.name}
                                                </a>
                                            </td>
                                            <td>{order.house.address}</td>
                                            <td>{formatCurrency(order.revenue)}</td>
                                            <td>
                                                {order.status.id === 3 ? (
                                                    <div>
                                                        <button style={{border:'none'}} className="custom-button custom-button--primary" onClick={() => yes(order)}>
                                                            Chấp nhận
                                                        </button>
                                                        <button style={{border:'none'}} className="custom-button custom-button--danger" onClick={() => no(order)}>
                                                            Từ chối
                                                        </button>
                                                    </div>
                                                ) : order.status.id === 5 ? (
                                                    <div>Chấp nhận</div>
                                                ) : (
                                                    <div>Từ chối</div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            ))}
                        </table>
                    </div>
                </body>


            </div>
            <div style={{marginTop:'1rem'}}>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</a>
                        </li>{renderPageItems()}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <a className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="footer">
                <Footer />
            </div>
        </>
    )
}

export default Confirm;