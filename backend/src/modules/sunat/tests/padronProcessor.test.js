jest.mock("../infrastructure/services/padronProcessor", () => ({
    downloadPadron: jest.fn(),
    extractTXT: jest.fn(),
    loadPadronToDB: jest.fn(),
  }));
  
  const {
    downloadPadron,
    extractTXT,
    loadPadronToDB,
  } = require("../infrastructure/services/padronProcessor");
  
  const ejecutarImportacionSunat = require("../application/useCases/ejecutarImportacionSunat");
  
  describe("🧪 ejecutarImportacionSunat", () => {
    beforeEach(() => jest.clearAllMocks());
  
    it("✅ ejecuta correctamente el proceso de importación", async () => {
      extractTXT.mockResolvedValue("archivo.txt");
      await ejecutarImportacionSunat();
  
      expect(downloadPadron).toHaveBeenCalled();
      expect(extractTXT).toHaveBeenCalled();
      expect(loadPadronToDB).toHaveBeenCalledWith("archivo.txt");
    });
  });  