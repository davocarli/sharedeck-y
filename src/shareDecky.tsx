import { useContext } from "react"
import { ShareDeckContext } from "./context"
import GamePicker from "./pages/gamePicker"
import GameReports from "./pages/reportViewer"
import { DefaultProps } from "./utils"

export const ShareDecky = ({ serverApi }: DefaultProps) => {
	const { selectedGame, setSelectedGame } = useContext(ShareDeckContext)

	if (selectedGame === null) return <GamePicker />

	return <GameReports serverApi={serverApi} />
}
