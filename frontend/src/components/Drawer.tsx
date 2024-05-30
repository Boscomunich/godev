import { Drawer } from 'antd';
import { SetStateAction } from 'react';
import { GoSun } from 'react-icons/go';
import { PiMoonLight } from 'react-icons/pi';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

type drawerProps = {
    open: boolean,
    onClose: () => void,
    darkMode: boolean,
    setDarkMode: React.Dispatch<SetStateAction<boolean>>
}

const DrawerComponent = ({open, onClose, darkMode, setDarkMode}: drawerProps) => {

    return (
        <>
        <Drawer
        title={<span className='dark:text-white'>Control Panel</span>}
        placement='left'
        closable={false}
        onClose={onClose}
        open={open}
        className='dark:bg-primary dark:text-white'>
            <div className="relative flex justify-center items-center pb-3 md:pb-0 sm:pb-0"
            onClick={() => setDarkMode(!darkMode)}>
            {
                darkMode ? 
                <GoSun className="h-5 w-5 font-semibold dark:text-white"/>
                : 
                <PiMoonLight className="h-5 w-5 font-semibold"/>
            }
        </div>
        </Drawer>
        </>
    );
};

export default DrawerComponent;