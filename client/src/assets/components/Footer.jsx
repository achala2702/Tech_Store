
const Footer = () => {

    const year = new Date().getFullYear()
  return (
    <div className="bg-black w-screen flex flex-col text-white min-h-60">
        <div className="text-center mt-auto">©{year} by Tech Store</div>
    </div>
  )
}

export default Footer