
import {Outlet} from 'react-router-dom';
import MenuBar from '../components/MenuBar';
import FunkyFooter from '../components/FunkyFooter';
const Main = () => {
    return (
        <div>
            <MenuBar/>
            <Outlet/>
            <FunkyFooter/>
        </div>
    );
};

export default Main;