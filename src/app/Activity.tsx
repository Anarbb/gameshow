import { useEffect, useState } from 'react'
import { useDiscordSdk } from '../hooks/useDiscordSdk'
import { Home } from './Home'


export const Activity = () => {
    const { authenticated, discordSdk, status, session } = useDiscordSdk()
    const [channelName, setChannelName] = useState<string>()

	// generate avatarUri from session
	// if session is not available, use a placeholder
    const avatarUri = session?.user ? `https://cdn.discordapp.com/avatars/${session.user.id}/${session.user.avatar}.png?size=256` : undefined
	// generate username from session
	// if session is not available, use a Sage
	const username = session?.user.username ? session.user.username : 'Sage' // Fallback to 'User' if username is not available
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

    return <Home channelName={channelName} status={status} avatarUri={avatarUri} username={username} />
}
