export default function MenuPage({ params }: { params: { qr_token: string } }) {
  return <div>Menú QR — {params.qr_token}</div>
}
