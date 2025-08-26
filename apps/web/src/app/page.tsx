import { Suspense } from 'react'
import { Hero } from '@/components/sections/Hero'
import { FeaturedEvents } from '@/components/sections/FeaturedEvents'
import { Categories } from '@/components/sections/Categories'
import { WhyChooseTix } from '@/components/sections/WhyChooseTix'
import { Stats } from '@/components/sections/Stats'
import { Newsletter } from '@/components/sections/Newsletter'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ModalProvider } from '@/components/providers/ModalProvider'
import { CartSidebar } from '@/components/cart/CartSidebar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Featured Events */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedEvents />
            </Suspense>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <Categories />
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <Stats />
          </div>
        </section>

        {/* Why Choose TIX */}
        <section className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700">
          <div className="container mx-auto px-4">
            <WhyChooseTix />
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gray-900 dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <Newsletter />
          </div>
        </section>
      </main>

      <Footer />
      
      <ModalProvider />
      <CartSidebar />
    </div>
  )
}