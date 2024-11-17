import signup from '../assets/signup.png';
import AuthImage from '../components/Auth/AuthImage';
import RegisterForm from '../components/Auth/RegisterForm';
import Header from '../components/Header/Header';

const Register = () => {

    return (
        <>
            <Header />
            <div className='max-w-[1800px] mx-auto flex justify-evenly items-stretch my-5 gap-6 px-6 font-nunito'>
                <div className='w-full md:w-1/2 h-full p-10 rounded-lg dark:bg-dark-background2'>
                    <RegisterForm />
                </div>
                <div className='md:w-1/2 h-[80vh]'>
                    <AuthImage image={signup} />
                </div>
            </div>
        </>
    )
};

export default Register;
