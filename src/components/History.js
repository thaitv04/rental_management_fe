import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SideBar from "./sidebar/sidebar";
import { da } from "date-fns/locale";
import moment from "moment";
import Footer from "./Footer";
import "../css/history.css"

function History() {
    const [order, setOrder] = useState([]);
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');
    const role = sessionStorage.getItem('role');
    const idAccount = sessionStorage.getItem('account_id');
    const [today, setToday] = useState(new Date());
    const [day, setDay] = useState();
    // const moment = moment();

    console.log(order)

    async function getHistory() {
        const res = await axios.get(`http://localhost:8080/api/order/${idAccount}`);
        setOrder(res.data);
        setToday(new Date());
        console.log(order);
    }

    // function DateParser({ date }) {

    //     const moments = moment(date);
    //     setDay(moments.toDate().getDate());
    //     // const [year, month, day] = date.split('-');
    //     // console.log(day)
    //     // setDay(day);
    // }

    useEffect(() => {
        getHistory();
    }, [])

    async function cancelOrder(item) {
        const response = await axios.put(`http://localhost:8080/api/order/${item.id}`, {
            timeStart: item.timeStart,
            timeEnd: item.timeEnd,
            revenue: item.revenue,
            total: item.total,
            idHouse: item.house.id,
            idAccount: idAccount
        });
        if (response.data) {
            // Cập nhật lại danh sách đơn hàng sau khi hủy thành công
            getHistory();
        }
    }
    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPage, setItemsPage] = useState(10);
    const totalPages = Math.ceil(order.length / itemsPage);

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPage;
        const endIndex = startIndex + itemsPage;
        return order.slice(startIndex, endIndex);
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
    return (
        <div style={{ height: '100vh' }}>

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
                <div className="container" style={{ marginTop: '2%' }}>
                    <h2>Danh sách nhà đang thuê</h2>
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Thời gian</th>
                                <th>Tên nhà</th>
                                <th>Số ngày thuê</th>
                                <th>Tổng tiền</th>
                                <th>Địa chỉ</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.reverse().map((item, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{item.timeStart} đến {item.timeEnd}</td>
                                    <td><Link to="/detail" className="custom-link">{item.house.name}</Link></td>
                                    <td>{item.total}</td>
                                    <td>{formatCurrency(item.revenue)}</td>
                                    <td>{item.house.address}</td>
                                    <td>
                                        {(() => {
                                            switch (item.status.id) {
                                                case 1:
                                                    return 'Từ trối';
                                                case 2:
                                                    return 'Đã thuê';
                                                case 3:
                                                    return 'Đang trờ duyệt';
                                                default:
                                                    return 'a';
                                            }
                                        })()}
                                    </td>

                                    <td>
                                        {moment(item.timeStart).toDate().getDate() > today.getDate() && moment(item.timeStart).toDate().getDate() - today.getDate() >= 1 ? (
                                            <button type="button" style={{ border: 'none' }} onClick={() => cancelOrder(item)} className="custom-button custom-button--danger">
                                                Hủy thuê
                                            </button>
                                        ) : moment(item.timeStart).toDate().getDate() < today.getDate() && item.status.name !== "Đã thuê" ? (
                                            <div className="custom-text">Quá hạn thuê</div>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ marginTop: '1rem' }}>
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
            </body>
        </div>
    )
}

export default History;