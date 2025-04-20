import React from 'react'

interface NavBarProps {
	avatarUri?: string
	username?: string
    displayName?: string
	powerPoints?: number // Add this new prop
}

export const NavBar: React.FC<NavBarProps> = ({
	avatarUri,
	username,
	displayName,
	powerPoints = 6 // Default value of 6
}) => {
	return (
		<>
			<div
				style={{
					position: 'fixed',
					top: '10px',
					left: '20px',
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
					zIndex: 1000
				}}
			>
				{/* avatar or placeholder - top left*/}
				{avatarUri ? (
					<img
						src={avatarUri}
						alt="User avatar"
						style={{
							width: '40px',
							height: '40px',
							borderRadius: '50%',
							objectFit: 'cover'
						}}
					/>
				) : (
					<div
						style={{
							width: '40px',
							height: '40px',
							borderRadius: '50%',
							backgroundColor: '#e0e0e0',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							fontSize: '18px',
							fontWeight: 'bold',
							color: '#666'
						}}
					>
						.
					</div>
				)}
				<h3 style={{ margin: 0 }}>Hello, {displayName}.</h3>
			</div>

			{/* Hearts in top right */}
			<div
				style={{
					position: 'fixed',
					top: '10px',
					right: '20px',
					display: 'flex',
					gap: '5px',
					zIndex: 1000
				}}
			>
				<span style={{ color: 'red', fontSize: '24px' }}>❤</span>
				<span style={{ color: 'red', fontSize: '24px' }}>❤</span>
				<span style={{ color: 'red', fontSize: '24px' }}>❤</span>
			</div>

			{/* Power Points under hearts */}
			<div
				style={{
					position: 'fixed',
					top: '45px',
					right: '20px',
					display: 'flex',
					alignItems: 'center',
					gap: '5px',
					zIndex: 1000
				}}
			>
				<span
					style={{
						fontWeight: 'bold',
						fontSize: '18px'
					}}
				>
					{powerPoints} PP - ⚔️
				</span>
			</div>
		</>
	)
}
