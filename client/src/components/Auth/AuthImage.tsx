
interface IAuthImageProps {
    image: string;
}

const AuthImage: React.FC<IAuthImageProps> = ({ image }) => {
    return (

        <div className='hidden md:block w-full h-full'>
            <img src={image} alt="image" className='w-[100%] h-full rounded-md object-fill' />
        </div>
    )
};

export default AuthImage;
