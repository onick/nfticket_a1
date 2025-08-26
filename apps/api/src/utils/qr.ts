import QRCode from 'qrcode'

export async function generateQRCode(data: string): Promise<string> {
  try {
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    })
    
    return qrCodeDataURL
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`)
  }
}

export function parseQRCode(qrData: string): any {
  try {
    return JSON.parse(qrData)
  } catch (error) {
    throw new Error('Invalid QR code data')
  }
}