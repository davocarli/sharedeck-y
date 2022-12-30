import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib"
import { FaCogs } from "react-icons/fa"
import { ShareDecky } from "./shareDecky"
import { ShareDeckProvider } from "./context"

export default definePlugin((serverApi: ServerAPI) => {
	console.log("Loading ShareDeck-y")
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
