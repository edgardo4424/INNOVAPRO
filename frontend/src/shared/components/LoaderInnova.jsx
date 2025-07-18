import "./loaderInnova.css";

const LoaderInnova = () => {
   return (
      <div className="bg-[#061a5b]/80 w-full h-[100vh] flex flex-col items-center justify-center  ">
         <div className="mb-[20px] w-[50%] max-w-[300px]">
            <img src="/images/logo_loader.png" alt="Logo Innova" />
         </div>
         <div className="loader"></div>
      </div>
   );
};

export default LoaderInnova;
