import { DialogButton, PanelSectionRow } from "decky-frontend-lib"

type BackButtonProps = {
	onClick: () => void
}

const BackButton = ({ onClick }: BackButtonProps) => (
	<PanelSectionRow>
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				marginBottom: "5px",
			}}
		>
			<DialogButton
				style={{ maxWidth: "32%", flexGrow: 1 }}
				onClick={onClick}
			>
				Back
			</DialogButton>
			<div />
		</div>
	</PanelSectionRow>
)

export default BackButton
