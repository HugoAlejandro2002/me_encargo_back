
import { createReadStream } from 'fs';
import * as path from 'path';
import * as process from 'process';
import { google, drive_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Readable } from 'typeorm/platform/PlatformTools';
import dotenv from 'dotenv'

dotenv.config()

const pkey = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

interface ServiceAccountKey {
    client_email: string;
    private_key: string;
  }

// const pkey: ServiceAccountKey = require('./pk.json');

async function authorize(): Promise<JWT> {
    const jwtClient = new google.auth.JWT(
      pkey.client_email,
      undefined, // The key file is not needed when using the private key directly
      pkey.private_key,
      SCOPES
    );
    
    await jwtClient.authorize();
    return jwtClient;
}


const SCOPES: string[] = ['https://www.googleapis.com/auth/drive.file'];

async function uploadFile(authClient: JWT, pdfBuffer: Buffer, title: String) {
    const drive = google.drive({ version: 'v3', auth: authClient });
    
    const fileMetaData = {
        name: `${title}-${new Date()}.pdf`,
        parents: ["1rHhylKi5ZkVvpR51O4hG0jdAnoZDle-I"]   
    }

    const bufferStream = new Readable();
    bufferStream.push(pdfBuffer);
    bufferStream.push(null);

    const file = await drive.files.create({
      media: {
        mimeType: "application/pdf",
        body: bufferStream
      },
      fields: 'id, webViewLink',
      requestBody: fileMetaData
    });
  
    await makeFilePublic(authClient, file.data.id!)
    return file.data
}

async function makeFilePublic(authClient: JWT, fileId: string): Promise<void> {
  const drive = google.drive({ version: 'v3', auth: authClient });

  await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      role: 'reader', // Reader role gives view-only access
      type: 'anyone', // Anyone on the internet can access
    },
  });
}

const sentProductsPDF = async (tableData: any[]) => {
    const jwt = await authorize()
    const doc = new jsPDF()
        
    const titleX = 20; // X position for text
    const titleY = 30; // Y position for text
    const titleWidth = 180; // Width of the background rectangle
    const titleHeight = 25; // Height of the background rectangle

    doc.setFillColor(29,213,144);
    doc.rect(titleX - 2, titleY - 6, titleWidth, titleHeight, 'F');

    doc.setFontSize(18)
    doc.setTextColor("white")
    doc.text("COMPROBANTE DE PRODUCTOS ENTREGADOS", titleX+5, titleY+5)
    doc.text("AL ALMACEN", titleX+50, titleY+15)

    doc.setFontSize(10)
    doc.setTextColor("black")
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`,
            doc.internal.pageSize.width - 50,
            titleY + titleHeight + 5,
            )
            
    const tableX = titleX
    const tableY = titleY + titleHeight + 15;
    const productData: any[] = tableData.map((val: any) => [
        val.producto,
        val.unitario,
        val.cantidad,
        val.total]);
            
    productData.push(['Total', '', '', `${tableData.reduce((acc: number, val: any) => acc+val.total,0)}`]);

      (doc as any).autoTable({
        head:[['Producto','Precio Unitario (Bs)','Cantidad','Total (Bs)']],
        body: productData,
        columnStyles:{
            0:{cellWidth:80},
            1:{cellWidth:40},
            2:{cellWidth:20},
            3:{cellWidth:30}
        },
        headStyles:{
            fillColor: [29,213,144],
            textColor: "white"
        },
        startY: tableY,
        margin: {left: tableX},
        didDrawPage: (data: any) => {
            const finalY = data.cursor.y; // Get the Y-coordinate where the table ends
            
            // Add text below the table
            doc.setFontSize(10)
            doc.setTextColor('black')
            doc.text('FIRMA', tableX + 30, finalY + 30); 
            doc.text("Nombre Engcargado:", tableX + 10, finalY + 40)
            doc.text("CI:",tableX + 10, finalY+50)

            doc.text('FIRMA', doc.internal.pageSize.width / 2 + 30 , finalY + 30); 
            doc.text("Nombre Cliente:", doc.internal.pageSize.width / 2 + 10, finalY + 40)
            doc.text("CI:", doc.internal.pageSize.width / 2 + 10, finalY+50)
        }
    })

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    // Upload the generated PDF
    const response = await uploadFile(jwt, pdfBuffer, 'ComprobanteProductos');
    return response
        
}

const sentPaymentPDF = async (tableData: any[], paymentData: any[]) => {
 try {
  
   const jwt = await authorize()
   const doc = new jsPDF()
   
   const titleX = 20; // X position for text
   const titleY = 30; // Y position for text
   const titleWidth = 170; // Width of the background rectangle
   const titleHeight = 10; // Height of the background rectangle
 
   doc.setFillColor(29,213,144);
   doc.rect(titleX - 2, titleY - 6, titleWidth, titleHeight, 'F');
 
   doc.setFontSize(18)
   doc.setTextColor("white")
   doc.text("COMPROBANTE DE PAGOS", titleX + 40, titleY)
 
   doc.setFontSize(10)
   doc.setTextColor("black")
   doc.text(`Fecha: ${new Date().toLocaleDateString()}`,
           doc.internal.pageSize.width - 50,
           titleY + titleHeight + 5,
         )
     
   doc.text(`Cliente: Deborah Matienzo Gamon`,
     titleX, 
     titleY + titleHeight + 5
   )
 
   const tableX = titleX
   const tableY = titleY + titleHeight + 15;
   (doc as any).autoTable({
       head:[['Producto','Precio Unitario (Bs)','Cantidad','Total (Bs)']],
       body: tableData.map((val,i)=>[val.producto,val.unitartio,val.cantidad,val.total]),
       columnStyles:{
           0:{cellWidth:80},
           1:{cellWidth:40},
           2:{cellWidth:20},
           3:{cellWidth:30}
       },
       headStyles:{
           fillColor: [29,213,144],
           textColor: "white"
       },
       startY: tableY,
       margin: {left: tableX},
   })
   (doc as any).autoTable({
     head:[['Fecha','ADELANTOS RECIBIDOS DE CLIENTES (Bs)']],
     body: paymentData.map((val,i)=>[val.date,val.client]),
     columnStyles:{
         0:{cellWidth:80},
         1:{cellWidth:40},
     },
     headStyles:{
         fillColor: [29,213,144],
         textColor: "white"
     },
     margin: {left: tableX},
     didDrawPage: (data: any) => {
       const finalY = data.cursor.y; // Get the Y-coordinate where the table ends
       doc.setFontSize(10)
       doc.setTextColor('black')
 
       doc.text(`PAGO REALIZADO: ${tableData.reduce((acc: number, val: any) => acc+val.total,0) - paymentData.reduce((acc, val) => acc+val.client, 0)} Bs`,
         titleX, 
         finalY + 5
       )
 
       doc.text('FIRMA', tableX + 30, finalY + 30); 
       doc.text("Nombre Cliente:", tableX , finalY + 40)
       doc.text("CI:",tableX , finalY+50)
     }
   })
   const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
   // Upload the generated PDF
   const response = await uploadFile(jwt, pdfBuffer, "ComprobantePago");
   return response
 } catch (error) {
  console.error(error)
 } 
}

export const googleDrive = {
    sentProductsPDF,
    sentPaymentPDF
}