import { FinishOrder } from '@/components/finish-order'
import { Layout } from '@/components/layout'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { GlobalProvider } from '@/contexts/GlobalContext'
import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<AuthProvider>
				<GlobalProvider>
					<Layout>
						<Toaster />
						<FinishOrder />
						<Component {...pageProps} />
					</Layout>
				</GlobalProvider>
			</AuthProvider>
		</ThemeProvider>
	)
}
