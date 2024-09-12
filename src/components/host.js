import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import "../css/host.css"

function HostList() {
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');
    const role = sessionStorage.getItem('role');
    const idAccount = sessionStorage.getItem('account_id');
    const [houses, setHouses] = useState([]);
    // const [search, setSearch] = useState('');
    const filteredData = houses.filter(house => house.account.id === parseInt(idAccount));

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPage, setItemsPage] = useState(10);
    const totalPages = Math.ceil(filteredData.length / itemsPage);

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPage;
        const endIndex = startIndex + itemsPage;
        const reversedData = [...filteredData].reverse();
        return reversedData.slice(startIndex, endIndex);
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

    async function getList() {
        const response = await axios.get(`http://localhost:8080/api/house`);
        setHouses(response.data)
        console.log(idAccount)
    };

    useEffect(() => {
        getList()
    }, [])
    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    async function deleteHouse(id){
        if(window.confirm("Bạn có chắc muốn xóa nhà không !")){
            const response=await axios.delete(`http://localhost:8080/api/house/${id}`);
         } getList();
    }

    useEffect(() => {
        getList()
    }, [])

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
            <body>
                <div className="container">
                    <ul class="nav nav-tabs">
                        <Link to="/create">
                            <button type="button" className="btn btn-primary" style={{ marginRight: "2%", position: 'absolute', left: "77%" }}>Đăng nhà
                            </button>
                        </Link>
                        <li class="nav-item">
                            <a class="nav-link active" href="/host">Danh sách nhà cho thuê</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link " href={`/order/${idAccount}`}>Danh sách đăng ký thuê</a>
                        </li>
                    </ul>


                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên nhà</th>
                                <th>Địa chỉ</th>
                                <th>Giá</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((house, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                        <a href={`detail/${house.id}`} className="custom-link">
                                            {house.name}
                                        </a>
                                    </td>
                                    <td>{house.address}</td>
                                    <td>{formatCurrency(house.price)}</td>
                                    <td>
                                        <button style={{border:'none'}} type="button" className="custom-button custom-button--secondary" onClick={() => window.location.href = `edit/${house.id}`}>
                                            Sửa nhà
                                        </button>
                                      <Link className="btn btn-danger ml-2" onClick={()=> deleteHouse(house.id)}>Xóa</Link>
                                    </td>
                                    <td>
                                            
                                        </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </body>
            <div style={{ marginTop: '1rem' }}>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</a>
                        </li>
                        {renderPageItems()}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <a className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</a>
                        </li>

                    </ul>
                </nav>
            </div>
            <div className="footer">
                <Footer />
            </div>
        </div>
    )
}


export default HostList; 
