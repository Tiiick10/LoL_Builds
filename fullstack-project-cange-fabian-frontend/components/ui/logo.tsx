import Link from "next/link"
import Image from "next/image"
import logo from "/../public/images/logo.svg"

export default function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0">
      <Image src={logo} alt="Logo" width={32} height={32} />
    </Link>
  )
}
