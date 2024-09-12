function Navbar(){
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');
    const role = sessionStorage.getItem('role');
    const idAccount = sessionStorage.getItem('account_id');
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary"
             style={{boxShadow: " 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 20px 0 rgba(0, 0, 0, 0.19)"}}>
            <div className="container-fluid">
                <div className="navbar w-100">
                    <a className="navbar-brand" href="/home">Agoda</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <ul className="nav nav-underline">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/home">Trang chủ</a>
                        </li>

                    </ul>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                        <div className="navbar-nav ">

                            {/* <a className="nav-link" href="#" style={{ Left: "420%" }}>Login</a>
                                    <p style={{ marginTop: '0.40em' }}>|</p>
                                    <a className="nav-link" href="#">Sign in</a> */}

                            <div className="dropdown">

                                {role === 'admin' || role === 'host' ? (
                                    <div className="btn-group dropstart">
                                        <div>

                                            <button type="button" className="btn btn-secondary dropdown-toggle"
                                                    data-bs-toggle="dropdown" aria-expanded="false">
                                                {username}
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li><a className="dropdown-item" href="/host">Chủ nhà</a></li>
                                                <li><a className="dropdown-item" href="/create">Đăng nhà</a>
                                                </li>
                                                <li><a href={`/history/${idAccount}`} className="dropdown-item">Lịch sử
                                                    đặt</a></li>
                                                <li><a className="dropdown-item" href="#">Chi tiết tài khoản</a>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                ) : (
                                    <div>
                                        <button type="button" className="btn btn-secondary dropdown-toggle"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                            {username}
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a href={`/history/${idAccount}`} className="dropdown-item">Lịch sử
                                                đặt</a>
                                            </li>
                                            <li><a className="dropdown-item" href="#">Chi tiết tài khoản</a></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;