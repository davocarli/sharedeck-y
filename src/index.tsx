import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib"
import { useContext } from "react"
import { FaCogs } from "react-icons/fa"
import { ShareDeckContext, ShareDeckProvider } from "./context"
import GamePicker from "./pages/gamePicker"
import GameReports from "./pages/reportViewer"

const ShareDecky = ({ serverApi }: { serverApi: ServerAPI }) => {
	const { selectedGame } = useContext(ShareDeckContext)

	if (selectedGame === null) return <GamePicker />

	return <GameReports serverApi={serverApi} />
}

export default definePlugin((serverApi: ServerAPI) => {
	return {
		title: <div className={staticClasses.Title}>ShareDeck-y</div>,
		content: (
			<ShareDeckProvider>
				<ShareDecky serverApi={serverApi} />
			</ShareDeckProvider>
		),
		icon: <FaCogs />,
		alwaysRender: true,
	}
})
