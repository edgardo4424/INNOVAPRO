import GuiaRemisionForm from "../emitir/guia-de-remision/GuiaRemisionForm";

const GuiaRemision = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 py-6 md:px-8">
      <div className="w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-600 md:text-3xl">
            Guia de Remision
          </h2>
        </div>
        <GuiaRemisionForm />
      </div>
    </div>
  );
};

export default GuiaRemision;
