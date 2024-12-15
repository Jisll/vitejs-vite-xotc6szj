import '@/styles/globals.css';
import 'allotment/dist/style.css';
import 'react-toastify/dist/ReactToastify.css';

import type { AppProps } from 'next/app';
import { ClientProvider } from '@/contexts/ClientContext';
import { MonacoProvider } from '@/contexts/MonacoContext';
import { Provider } from 'react-redux';
import store from '@/store';
import { ToastContainer } from 'react-toastify';

import { Poppins } from 'next/font/google';

const poppins = Poppins({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-poppins',
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ClientProvider>
			<MonacoProvider>
				<Provider store={store}>
					<div className={poppins.variable}>
						<Component {...pageProps} />
					</div>
					<ToastContainer />
				</Provider>
			</MonacoProvider>
		</ClientProvider>
	)
}