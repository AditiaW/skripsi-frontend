import {Link} from "react-router-dom"
import { Check } from "lucide-react"

export default function OrderSuccessPage() {

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-500">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">What's Next?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            Back Home?
          </Link>
        </div>
      </div>
    </div>
  )
}

