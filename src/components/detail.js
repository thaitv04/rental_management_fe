import Navbar from "./navbar";
import "../css/detail.css"
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // theme css file
import { DatePicker, Space, message } from 'antd';
import moment from 'moment';
import Footer from "./Footer";
import dayjs from 'dayjs';


const { RangePicker } = DatePicker;
function Detail() {
    const navigate = useNavigate();
    const [house, setHouse] = useState({});
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');
    const role = sessionStorage.getItem('role');
    const idAccount = sessionStorage.getItem('account_id'); const price = house.price;

    const a = Number(house.price);
    const formattedNumber = a.toLocaleString();
    // console.log(house.price)
    const params = useParams();

    const [dateRange, setDateRange] = useState([]);
    const [numDays, setNumDays] = useState(0);

    const [dayStart, setDayStart] = useState(null);
    const [monthStart, setMonthStart] = useState(null);
    const [yearStart, setYearStart] = useState(null);

    const [dayEnd, setDayEnd] = useState(null);
    const [monthEnd, setMonthEnd] = useState(null);
    const [yearEnd, setYearEnd] = useState(null);

    const [currentDate, setCurrentDate] = useState(moment());
    const [datesDB, setDates] = useState([]);
    const [timeStarts, setTimeStarts] = useState([]);
    const [timeEnds, setTimeEnds] = useState([]);

    const [allDates, setAllDates] = useState([]);

    const [errorMessages, setErrorMessages] = useState([]);
    const formattedErrorMessages = errorMessages.map(dateString => {
        return moment(dateString).format('DD-MM-YYYY');
    });

    const [account, setAccount] = useState({});

    async function getAccount() {
        const res = await axios.get(`http://localhost:8080/api/account/${idAccount}`)
        console.log(res)
        setAccount(res.data);
    }

    useEffect(() => {
        getAccount()
    }, []);

    console.log(errorMessages)

    const handleDateRangeChange = (dates, dateStrings) => {
        setDateRange(dateStrings);
        const newErrorMessages = [];
        if (dates && moment(dateStrings[0], 'DD-MM-YYYY').isValid() && moment(dateStrings[1], 'DD-MM-YYYY').isValid()) {
            const startDate = moment(dateStrings[0], 'DD-MM-YYYY');
            const endDate = moment(dateStrings[1], 'DD-MM-YYYY');

            setYearStart(startDate.year());
            setMonthStart(startDate.month() + 1); // Tháng trong moment.js bắt đầu từ 0
            setDayStart(startDate.date());

            setYearEnd(endDate.year());
            setMonthEnd(endDate.month() + 1);
            setDayEnd(endDate.date());
            const daysDiff = endDate.diff(startDate, 'days') + 1;
            setNumDays(daysDiff);

            // Tạo mảng chứa tất cả các ngày từ startDate đến endDate
            const allDates = [];
            let currentDate = startDate.clone();
            while (currentDate.diff(endDate, 'days') <= 0) {
                allDates.push(currentDate.format('YYYY-MM-DD'));
                currentDate.add(1, 'days');
            }
            setAllDates(allDates);
            for (let i = 0; i < allDates.length; i++) {
                for (let j = 0; j < datesDB.length; j++) {
                    if (allDates[i] === datesDB[j]) {
                        newErrorMessages.push(allDates[i]);
                        setDateRange([])
                        setNumDays(0);
                        setAllDates([]);
                    }
                }

            }
            setErrorMessages(newErrorMessages)
        } else {
            setNumDays(0);
            setAllDates([]);
        }
    };

    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    async function getHouse() {
        const res = await axios.get(`http://localhost:8080/api/house/${params.id}`)
        setHouse(res.data);
    }

    useEffect(() => {
        getHouse();
        ListTime();
    }, []);
    const handleViewDirections = () => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(house.address)}`;
        window.open(googleMapsUrl, '_blank');
    };


    async function BookHouse(e) {
        e.preventDefault();

        const date = `${yearStart}-${monthStart}-${dayStart} -- ${yearEnd}-${monthEnd}-${dayEnd}`;
        const response = await axios.post('http://localhost:8080/api/order', {
            date: date,
            idHouse: params.id,
            total: numDays,
            revenue: numDays * price,
            idAccount: idAccount,
        })

        const Toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "Đặt thành công"
        }).then(() => {
            navigate("/home")
            // Navigate to home page after successful submission
        });
    }

    function formatPrice(price) {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    async function ListTime() {

        const res = await axios.get(`http://localhost:8080/api/order/time/${params.id}`);

        const newDates = [];
        const newTimeStarts = [];
        const newTimeEnds = [];

        if (res.data.length > 0) {
            res.data.forEach(item => {
                if (item.status.id === 2) {
                    const timeStart = new Date(item.timeStart);
                    const timeEnd = new Date(item.timeEnd);

                    newTimeStarts.push(timeStart.toISOString().slice(0, 10));
                    newTimeEnds.push(timeEnd.toISOString().slice(0, 10));

                    let currentDates = timeStart;
                    while (currentDates <= timeEnd) {
                        newDates.push(currentDates.toISOString().slice(0, 10));
                        currentDates.setDate(currentDates.getDate() + 1);
                    }
                }
            });
        }
        setDates(newDates);
        setTimeStarts(newTimeStarts);
        setTimeEnds(newTimeEnds);
    }

    const disabledDate = (current) => {
        return current && (current.isBefore(currentDate, 'day') || datesDB.includes(current.format('YYYY-MM-DD')));
    };
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

            <div class="blog-single">
                <div class="container-fluid " >

                    <div class="row justify-content-center">

                        <div class="col-lg-8 m-15px-tb">
                            <article style={{ overflow: "visible" }} className="article">
                                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-inner">
                                        {house.images?.map((item, index) => (
                                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                                style={{ height: '500px' }}>
                                                <img src={process.env.PUBLIC_URL + '/img/' + (item.nameImage)}
                                                    className="d-block w-100 h-100 object-fit-cover"
                                                    alt={`Carousel Image ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>

                                    <button className="carousel-control-prev" type="button"
                                        data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button"
                                        data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
                                <div className="test" style={{ display: "flex" }} >
                                    <div className="test1" style={{ marginTop: '4%' }}>
                                        <div style={{ display: "flex" }}>
                                            <h1 style={{ height: '55px', marginBottom: '0', lineHeight: '55px', marginRight: '8px' }}>{house.name}</h1>
                                            <h5 style={{
                                                lineHeight: '72px', height: '55px', marginBottom: '0'
                                            }}>({formattedNumber} VND/ ngày)</h5>

                                        </div>
                                        <p style={{ marginRight: '5px', fontStyle: 'italic', color: 'grey' }}>Ngày đăng:  {moment(house.createdAt).format('DD/MM/YYYY  HH:mm:ss')}</p>

                                        <div className="article-content">
                                            <div style={{ display: 'flex' }}>
                                                <h6 style={{ marginRight: '5px' }}>Số phòng ngủ: {house.numberOfBedRoom}</h6>
                                                <p>,</p>
                                                <h6 style={{ marginLeft: '5px' }}>Số phòng tắm: {house.numberOfBathRoom}</h6>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ marginRight: '8px', fontSize: '20px' }}><b>Địa chỉ:</b><br /> <small>{house.address}</small></p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ marginRight: '8px', fontSize: '20px' }}><b>Phương thức liên hệ:</b><br /><small>SĐT: {account.phoneNumber}</small></p>
                                        </div>
                                    </div>
                                    <div className="test2" style={{ position: 'sticky', left: '66%', marginTop: "4%", borderRadius: '10px', boxShadow: '0px 0px 8px #888888' }}>
                                        <div style={{ margin: '10%' }}>                                        <p>Ngày bắt đầu | Ngày kết thúc </p>
                                            <Space direction="vertical" size={12}>
                                                <RangePicker onChange={handleDateRangeChange}
                                                    disabledDate={disabledDate}
                                                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                                    format="DD-MM-YYYY"
                                                    value={dateRange.length > 0 ? [dayjs(dateRange[0], 'DD-MM-YYYY'), dayjs(dateRange[1], 'DD-MM-YYYY')] : []}
                                                    style={{
                                                        padding: '8px 12px',
                                                    }}
                                                />
                                            </Space>
                                            <p>Số ngày thuê: {numDays}</p>
                                            <p>Tổng tiền: {formatCurrency(numDays * price)} </p>
                                            {formattedErrorMessages.length > 0 && <div>
                                                <span style={{ color: 'red' }}>Ngày </span>
                                                {formattedErrorMessages.map((mess, index) => (
                                                    <span key={index} style={{ color: 'red' }}>
                                                        {mess}
                                                        {index < formattedErrorMessages.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                                <span style={{ color: 'red' }}> đã được đặt</span>
                                            </div>}


                                            <form onSubmit={BookHouse}>
                                                <input type="submit" value="Đặt nhà" />
                                            </form>

                                        </div>

                                    </div>
                                </div>
                            </article>
                            <div class="contact-form article-comment">
                                <h4>Nhận xét</h4>
                                <form id="contact-form" method="POST">
                                    <div class="row">

                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <textarea name="message" id="message"
                                                    placeholder="Để lại nhật xét của bạn" rows="4"
                                                    class="form-control"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-md-12" style={{ marginTop: "4%" }}>
                                            <button type="button" class="btn btn-outline-success">Đăng</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="footer">
                <Footer />
            </div>
        </div>
    )
}

export default Detail;