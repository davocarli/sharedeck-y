import { Router, ButtonItem } from 'decky-frontend-lib';
import { FaCoffee } from 'react-icons/fa';

function handleClick () {
    Router.NavigateToExternalWeb("https://ko-fi.com/nickbelzer");
}

export default function BuyCoffee () {
    return (<ButtonItem bottomSeparator='standard' onClick={handleClick}><FaCoffee/> Support ShareDeck</ButtonItem>)
}
