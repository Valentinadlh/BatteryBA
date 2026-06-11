import Header from "./components/Header"
import Battery from "./components/Battery"  
import { useCart } from "./hooks/useCart"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const {
    data,
    cart,
    addToCart,
    removeAllCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart()

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeAllCart={removeAllCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((battery) => (  
            <Battery  
              key={battery.id}
              id={battery.id}
              name={battery.name}
              price={battery.price}
              image={battery.image}
              description={battery.description}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            BatteryBA - Todos los derechos Reservados
          </p>
        </div>
      </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App