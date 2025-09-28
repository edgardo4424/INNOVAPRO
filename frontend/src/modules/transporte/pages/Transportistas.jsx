import TransportistasLayout from "../components/tranportistas/layout/TransportistasLayout";

const Transportistas = () => {
  return (
    <div className="flex w-full flex-col items-center py-6 md:px-8">
      <div className="w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">
            Transportistas
          </h2>
        </div>
        <TransportistasLayout />
      </div>
    </div>
  );
};

export default Transportistas;
