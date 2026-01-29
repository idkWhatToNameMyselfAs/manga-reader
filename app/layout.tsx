import { Inter, Open_Sans } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const openSans = Open_Sans({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: 
{ children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${openSans.className}`}>
        {children}
      </body>
    </html>
  )
}