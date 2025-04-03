import { FaDiscord } from 'react-icons/fa';
import { FaTwitch } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';

const links = [
	{ href: 'https://discord.com', icon: <FaDiscord /> },
	{ href: 'https://twitch.com', icon: <FaTwitch /> },
	{ href: 'https://twitter.com', icon: <FaTwitter /> },
	{ href: 'https://github.com/ridwanyinus/zentry-clone', icon: <FaGithub /> },
];

const Footer = () => {
	return (
		<footer className="w-screen bg-violet-300 py-4 text-black">
			<div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
				<p className="text-center text-xs md:text-left">
					&copy; Zentry 2024. All rights reserved
				</p>

				<div className="flex justify-center gap-4 md:justify-start">
					{links.map((link, index) => (
						<a
							key={index}
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Link to ${link.href}`}
							className="text-black transition-colors duration-500 ease-in-out hover:text-white"
						>
							{link.icon}
						</a>
					))}
				</div>
				<a
					href="#privacy-policy"
					className="text-black transition-colors duration-500 ease-in-out hover:underline text-xs"
				>
					Privacy Policy
				</a>
			</div>
			<p className="container mx-auto text-xs text-center md:text-end border-t border-black mt-2 pt-2 md:pl-2">
				Check out the original inspiration at{' '}
				<a
					className="underline"
					href="https://zentry.com"
					target="_blank"
					rel="noopener noreferrer"
				>
					Zentry.com
				</a>{' '}
				<br className="md:hidden" /> Images and videos belong to them.
			</p>
		</footer>
	);
};

export default Footer;
