import login from '../assets/login.png';
import AuthImage from "../components/Auth/AuthImage";
import LoginForm from '../components/Auth/LoginForm';

const Login = () => {
    return (
        <div className='max-w-[1800px] mx-auto flex justify-evenly items-stretch mt-20 gap-6 px-6 font-nunito'>
            <div className='w-full md:w-1/2 h-[60vh] bg-light-blue p-10 rounded-lg'>
                <LoginForm />
            </div>
            <div className='md:w-1/2 h-[60vh]'>
                <AuthImage image={login} />
            </div>
        </div>
    )
};

export default Login;
