import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { ProductsProvider } from './context/ProductsContext'
import { StoreProvider } from './context/StoreContext'
import { FavouritesProvider } from './context/FavouritesContext'
import { OrdersProvider } from './context/OrdersContext'
import { AddressesProvider } from './context/AddressesContext'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <ProductsProvider>
          <StoreProvider>
            <FavouritesProvider>
              <OrdersProvider>
                <AddressesProvider>
                  <App />
                </AddressesProvider>
              </OrdersProvider>
            </FavouritesProvider>
          </StoreProvider>
        </ProductsProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
