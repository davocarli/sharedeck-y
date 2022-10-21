import { Router, ButtonItem, ButtonItemProps } from 'decky-frontend-lib';
import { FC } from 'react';

interface LinkButtonProps extends ButtonItemProps {
    url: string,
}

export const LinkButton: FC<LinkButtonProps> = (props) => {
    props.onClick = () => Router.NavigateToExternalWeb(props.url);
    return <ButtonItem {...props}/>
}
