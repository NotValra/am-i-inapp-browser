import React, { useState, useEffect } from 'react'
import './App.css'
import InApp from './inapp'
import attempt2 from './attempt2'
import { useQuery } from 'react-query'
import ExternalLink from './ExternalLinkIcon'
import attempt4 from 'is-ua-webview'

function App() {
	const [inApp, setInApp] = useState({})
	const [openLink, setOpenLink] = useState(null)

	useEffect(() => {
		const useragent = navigator.userAgent || navigator.vendor || window.opera
		const inapp = new InApp(useragent)
		setInApp(inapp)
	}, [])

	const { isLoading, error, data } = useQuery('whatismybrowser', () =>
		fetch('https://api.whatismybrowser.com/api/v2/user_agent_parse', {
			method: 'post',
			body: JSON.stringify({
				user_agent: navigator.userAgent || navigator.vendor || window.opera,
			}),
			headers: {
				'x-api-key': import.meta.env.VITE_WIMB_KEY,
				'Content-Type': 'application/json',
			},
		}).then(res => res.json())
	)

	useEffect(() => {
		if (inApp.isInApp) {
			setOpenLink('https://example.com') // Set the link you want to open
		} else if (attempt2) {
			setOpenLink('https://example2.com') // Set the link you want to open
		} else if (data && data.parse.software_sub_type === 'in-app-browser') {
			setOpenLink('https://example3.com') // Set the link you want to open
		} else if (attempt4(navigator.userAgent || navigator.vendor || window.opera)) {
			setOpenLink('https://example4.com') // Set the link you want to open
		}
	}, [inApp.isInApp, attempt2, data, error])

	const openSpecificLink = () => {
		if (openLink) {
			window.open(openLink, '_system', 'location=yes')
		}
	}

	return (
		<div className='App'>
			<h1>Am I inside an in-app browser? 🤔</h1>
			<p style={{ fontSize: '14px' }}>
				<b>User Agent: </b>
				{inApp.ua}
			</p>

			<div className='grid-attempts'>
				<section>
					<h3>
						Attempt 1{' '}
						<a
							href='https://github.com/f2etw/detect-inapp/blob/master/src/inapp.js'
							target='_blank'
							rel='noopener noreferrer'
						>
							<ExternalLink />
						</a>
					</h3>
					<p>
						<span style={{ color: inApp.isInApp ? 'green' : 'red', fontWeight: 'bold' }}>
							{JSON.stringify(inApp.isInApp)}
						</span>
					</p>
				</section>

				<section>
					<h3>
						Attempt 2 (iOS only){' '}
						<a
							href='https://github.com/f2etw/detect-inapp/blob/master/src/inapp.js'
							target='_blank'
							rel='noopener noreferrer'
						>
							<ExternalLink />
						</a>
					</h3>
					<p>
						<span style={{ color: attempt2 ? 'green' : 'red', fontWeight: 'bold' }}>
							{JSON.stringify(attempt2)}
						</span>
					</p>
				</section>

				<section>
					<h3>
						Attempt 3{' '}
						<a href='https://developers.whatismybrowser.com/' target='_blank' rel='noopener noreferrer'>
							<ExternalLink />
						</a>
					</h3>
					{isLoading && <p>loading...</p>}
					{data && (
						<>
							<p>
								<span
									style={{
										color: data.parse.software_sub_type === 'in-app-browser' ? 'green' : 'red',
										fontWeight: 'bold',
									}}
								>
									{JSON.stringify(data.parse.software_sub_type === 'in-app-browser')}
								</span>
							</p>
						</>
					)}
					{error && <p>{error}</p>}
				</section>

				<section>
					<h3>
						Attempt 4{' '}
						<a href='https://github.com/atomantic/is-ua-webview/' target='_blank' rel='noopener noreferrer'>
							<ExternalLink />
						</a>
					</h3>
					<span
						style={{
							color: attempt4(navigator.userAgent || navigator.vendor || window.opera) ? 'green' : 'red',
							fontWeight: 'bold',
						}}
					>
						{JSON.stringify(attempt4(navigator.userAgent || navigator.vendor || window.opera))}
					</span>
				</section>
			</div>

			<details>
				<p>For attempt 1:</p>
				<div style={{ paddingLeft: '1em', fontStyle: 'italic' }}>
					<p>User Agent Summary: {JSON.stringify(inApp.browser)}</p>
					<p>
						Desktop? {JSON.stringify(inApp.isDesktop)} / Mobile? {JSON.stringify(inApp.isMobile)}
					</p>
				</div>
				<summary>click here for more details</summary>
				<p>For Attempt 3, using API:</p>
				<textarea cols='30' rows='10' readOnly value={JSON.stringify(data, undefined, 4)}></textarea>
			</details>

			{openLink && (
				<button onClick={openSpecificLink} style={{ marginTop: '20px' }}>
					Open Specific Link
				</button>
			)}

			<a href='https://github.com/luizcieslak/am-i-inapp-browser' target='_blank' rel='noopener noreferrer'>
				Source code
			</a>
		</div>
	)
}

export default App
