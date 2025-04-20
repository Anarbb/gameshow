import { DiscordContextProvider } from '../hooks/useDiscordSdk'
import { Activity } from './Activity'
import './App.css'


export default function App() {

	// i added scope to the DiscordContextProvider
	// to request the guilds scope, which is needed to get the channel name
	// this is needed to get the channel name
	// and the user avatar

	return (
		<DiscordContextProvider authenticate scope={['identify', 'guilds']}>
			<Activity />
		</DiscordContextProvider>
	)
}
