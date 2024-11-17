import login from '../assets/login.png';
import AuthImage from '../components/Auth/AuthImage';
import RegisterForm from '../components/Auth/RegisterForm';

const Register = () => {

    return (
        <div className='max-w-[1800px] mx-auto flex justify-evenly items-stretch my-5 gap-6 px-6 font-nunito'>
            <div className='w-full md:w-1/2 h-full bg-light-blue p-10 rounded-lg'>
                <RegisterForm />
            </div>
            <div className='md:w-1/2 h-[110vh]'>
                <AuthImage image={login} />
            </div>
        </div>
    )
};

export default Register;
