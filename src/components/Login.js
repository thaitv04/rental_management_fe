import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { date } from "yup";
import "../css/login.css"
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBCheckbox
}
    from 'mdb-react-ui-kit';

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const value = {
        data: {
            username: username,
            password: password
        }
    };
    async function Login(e) {
        e.preventDefault();
        const reponse = await axios.post('http://localhost:8080/api/account/login', {
            username: username,
            password: password
        })

        sessionStorage.setItem('username', username);
        sessionStorage.setItem('password', password);
        sessionStorage.setItem('account_id', reponse.data.id);
        sessionStorage.setItem('role', reponse.data.role);


        if (reponse.data.role === 'user') {
            navigate('/home')
        } else {
            navigate('/host')
        }

    }

    return (<>


        <section class="vh-100">

            <div class="container py-5 h-100">
                <div class="row d-flex align-items-center justify-content-center h-100">
                    <div class="col-md-8 col-lg-7 col-xl-6">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                            class="img-fluid" alt="Phone image" />
                    </div>

                    <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1">

                        <div style={{ padding: "10%", paddingTop: '10%' }} className="loginForm">
                            <h1>Đăng nhập</h1>
                            <form onSubmit={Login}>
                                {/* <!-- Email input --> */}
                                <div data-mdb-input-init class="form-outline mb-4">
                                    <label class="form-label" for="form1Example13">Tên tài khoản</label>
                                    <input type="text" id="form1Example13" class="form-control form-control-lg" onChange={(e) => setUsername(e.target.value)} />

                                </div>

                                {/* <!-- Password input --> */}
                                <div data-mdb-input-init class="form-outline mb-4">
                                    <label class="form-label" for="form1Example23">Mật khẩu</label>
                                    <input type="password" id="form1Example23" class="form-control form-control-lg" onChange={(e) => setPassword(e.target.value)} />

                                </div>

                                <div class="d-flex justify-content-around align-items-center mb-4">
                                    {/* <!-- Checkbox --> */}<div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="form1Example3" checked />
                                        <label class="form-check-label" for="form1Example3"> Ghi nhớ đăng nhập </label>
                                    </div>
                                    <a href="#!">Quên mật khẩu</a>
                                </div>

                                {/* <!-- Submit button --> */}
                                <button type="submit" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-lg btn-block w-100">Đăng nhập</button>

                                <div class="divider d-flex align-items-center my-4">
                                    <p class="text-center fw-bold mx-3 mb-0 text-muted">Hoặc</p>
                                </div>

                                <a data-mdb-ripple-init class="btn btn-primary btn-lg btn-block" style={{ marginBottom: '1%', backgroundColor: "#3b5998", width: '100%' }} href="#!"
                                    role="button">
                                    <i class="fab fa-facebook-f me-2"></i>Đăng nhập với Facebook
                                </a>
                                <a data-mdb-ripple-init class="btn btn-primary btn-lg btn-block" style={{ marginBottom: '1%', backgroundColor: "#55acee", width: '100%' }} href="#!"
                                    role="button">
                                    <i class="fab fa-twitter me-2"></i>Đăng nhập với Twitter</a>

                                <a data-mdb-ripple-init class="btn btn-primary btn-lg btn-block" style={{ backgroundColor: "#dc4e41", width: '100%' }} href="#!"
                                    role="button">
                                    <i class="fab fa-google me-2"></i>Đăng nhập với Google</a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>)
}

export default Login;