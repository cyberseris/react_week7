import { useState, useEffect, useCallback} from 'react'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage({setIsAuth}){

    const [account, setAccount] = useState({
        username: "example@test.com",
        password: "example"
    });

    const handleInputChange = (e) => {
        const { value, name } = e.target;
        setAccount({
        ...account,
        [name]: value
        })
    };

    const checkUserLogin = useCallback(async () => {
      try {
        await axios.post(`${BASE_URL}/v2/api/user/check`);
        setIsAuth(true);
      } catch (error) {
        console.log("使用者未登入")
      }
    },[setIsAuth])

    useEffect(() => {
        const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
        );
        axios.defaults.headers.common['Authorization'] = token;
        checkUserLogin();
    }, [checkUserLogin]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        const resLogin = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
        const { token, expired } = resLogin.data;
        
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        setIsAuth(true);

        } catch (error) {
          alert(error.response.data.message)
        }
    };

    return (<div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div className="form-floating mb-3">
            <input type="email" onChange={handleInputChange} name="username" className="form-control" id="username" value={account.username} placeholder="name@example.com" />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" onChange={handleInputChange} value={account.password} name="password" className="form-control" id="password" placeholder="Password" />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>        
    )
}

export default LoginPage;