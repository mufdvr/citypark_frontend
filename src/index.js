//import registerServiceWorker from './registerServiceWorker';
import { render } from 'react-dom'
import App from 'components/App'

const target = document.querySelector('#root')

render(App(), target)

//registerServiceWorker()
