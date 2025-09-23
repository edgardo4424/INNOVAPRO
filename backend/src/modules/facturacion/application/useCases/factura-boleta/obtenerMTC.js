const { chromium } = require('playwright');

module.exports = async (ruc) => {
    // ** Asignamos la URL del sitio web que vamos a scrapear
    // ** Esta URL es la del sitio web del Ministerio de Transportes y Comunicaciones
    // ** donde podemos consultar el código MTC de un RUC
    const urlGobierno = 'https://www.mtc.gob.pe/tramitesenlinea/tweb_tLinea/tw_consultadgtt/Frm_rep_intra_mercancia.aspx';

    // ** Lanzamos el navegador headless en segundo plano
    // ** Esto significa que no se va a abrir una ventana del navegador visible
    // ** y que vamos a poder scrapear el sitio web sin que nadie lo note
    const browser = await chromium.launch();

    // ** Creamos un contexto de navegador nuevo, que es donde se ejecuta una página
    // ** Un contexto de navegador es una forma de aislar las páginas entre sí,
    // ** de manera que no compartan cookies ni almacenamiento local
    const context = await browser.newContext();

    // ** Creamos una página nueva en el contexto de navegador
    const page = await context.newPage();

    try {
        // ** Navegamos a la URL del sitio web del Ministerio de Transportes y Comunicaciones
        await page.goto(urlGobierno);

        // ** Llenamos el formulario con el RUC que queremos consultar
        await page.fill('#txtValor', ruc);

        // ** Hacemos clic en el botón de búsqueda
        // ** y esperamos a que la página se cargue nuevamente
        await Promise.all([
            page.waitForNavigation(),
            page.click('#btnBuscar'),
        ]);

        // ** Esperamos a que la página cargue completamente
        // ** para asegurarnos de que todos los elementos estén cargados
        await page.waitForSelector('body');

        // ** Verificamos si se muestra el mensaje de "no encontrado"
        const mensajeElement = await page.$('span#lblMensaje');
        if (mensajeElement) {
            const mensajeTexto = await mensajeElement.innerText();
            if (mensajeTexto.includes('No se encontraron resultados')) {
                return {
                    codigo: 400,
                    respuesta: {
                        status: 400,
                        mensaje: "No se encontraron resultados",
                        estado: false,
                        data: null
                    }
                };
            }
        }

        // ** Extraemos los datos de la tabla
        // ** que contiene el código MTC y la razón social
        await page.waitForSelector('span#lblHtml table');
        const row = page.locator('span#lblHtml table tbody tr').nth(1);
        const [codigo, razon, rucExtra] = await Promise.all([
            row.locator('td').nth(1).innerText(),
            row.locator('td').nth(2).innerText(),
            row.locator('td').nth(3).innerText(),
        ]);

        // ** Devolvemos los datos de la tabla
        // ** con el código MTC y la razón social
        return {
            codigo: 200,
            respuesta: {
                mensaje: "MTC encontrado",
                estado: true,
                data: {
                    status: 200,
                    codigo_mtc: codigo.trim(),
                    razon_social: razon.trim(),
                    ruc: rucExtra.trim(),
                }
            }
        };
    } catch (err) {
        console.error('❌ Error al consultar MTC:', err);
        return {
            codigo: 500, respuesta: {
                mensaje: "No cuenta con Nro. MTC",
                estado: false,
                data: null
            }
        };
    } finally {
        // ** Cerramos el navegador headless
        // ** para liberar recursos del sistema
        await browser.close();
    }
};

