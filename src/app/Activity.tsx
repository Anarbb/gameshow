import { useEffect, useState } from 'react'
import { useDiscordSdk } from '../hooks/useDiscordSdk'
import { Home } from './Home'

export const Activity = () => {
	const { authenticated, discordSdk, status, session } = useDiscordSdk()
	const [channelName, setChannelName] = useState<string>()

	// if (!authenticated) {
	// 	return <div>Loading...</div>
	// }
	const avatarUri = session?.user
		? `https://cdn.discordapp.com/avatars/${session.user.id}/${session.user.avatar}.png?size=256`
		: undefined

	const username = session?.user.username ? session.user.username : 'Sage' // Fallback to 'User' if username is not available
	const displayName = session?.user.global_name ? session.user.global_name : 'Brimstone' // The user display name is the global name if available, otherwise the username
	useEffect(() => {
		if (!authenticated || !discordSdk.channelId || !discordSdk.guildId) {
			return
		}

		discordSdk.commands.getChannel({ channel_id: discordSdk.channelId }).then((channel) => {
			if (channel.name) {
				setChannelName(channel.name)
			}
		})
	}, [authenticated, discordSdk])

	return (
		<Home
			channelName={channelName}
			status={status}
			avatarUri={avatarUri}
			username={username}
			displayName={displayName}
		/>
	)
}
