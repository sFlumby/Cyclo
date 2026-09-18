import React, { useMemo } from "react"
import QRCodeLib from "qrcode"

export interface QRCodeProps {
  size?: number
  value?: string
  className?: string
}

export const QRCode = React.memo(function QRCode({
  size = 64,
  value = "https://cyclo.eu/passport",
  className = "",
}: QRCodeProps) {
  const qrData = useMemo(() => {
    try {
      const qr = QRCodeLib.create(value, { errorCorrectionLevel: "M" })
      const count = qr.modules.size
      let d = ""
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (qr.modules.get(r, c)) {
            d += `M${c},${r}h1v1h-1z `
          }
        }
      }
      return { d, count }
    } catch {
      return null
    }
  }, [value])

  if (!qrData) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${qrData.count} ${qrData.count}`}
      className={className}
      role="img"
      aria-label="QR code"
      shapeRendering="crispEdges"
    >
      <path d={qrData.d} fill="#0f172a" />
    </svg>
  )
})
