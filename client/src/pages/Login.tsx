import login from '../assets/login.png';
import AuthImage from "../components/Auth/AuthImage";
import LoginForm from '../components/Auth/LoginForm';
import Header from '../components/Header/Header';

const Login = () => {
    return (
        <>
            <Header />
            <div className='max-w-[1800px] h-[80vh] flex justify-evenly items-center mt-5 gap-6 px-6 font-nunito'>
                <div className='w-full md:w-1/2 h-[60vh] bg-light-secondary p-10 rounded-lg dark:bg-dark-background2'>
                    <LoginForm />
                </div>
                <div className='md:w-1/2 h-[60vh]'>
                    <AuthImage image={login} />
                </div>
            </div>
        </>
    )
};

export default Login;
