import { useEffect, useState } from 'react';
import DrawerComponent from '../components/Drawer';
import { FiMenu } from "react-icons/fi"
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { FiPlus } from "react-icons/fi";
import { Outlet } from 'react-router-dom';

type AuthUser = {
    email: string,
    id: string
}

const Dashboard = () => {

    const[darkMode, setDarkMode] = useState(false)
    const [open, setOpen] = useState(false);
    const auth: AuthUser | null = useAuthUser()

    const showDrawer = () => {
        setOpen(true);
        console.log(auth)
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const theme = localStorage.getItem('theme')
        if (theme == 'dark') setDarkMode(true)
    },[])

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    })

    return (
        <>
            <div className="flex justify-center sm:justify-between items-center md:justify-between h-[50px] gap-4 w-screen pl-4 py-3 bg-gray-200 fixed top-0 dark:bg-gray-900">
                <div onClick={showDrawer} className="p-1 sm:flex dark:text-white w-[10%]">
                    <FiMenu/>
                </div>
                <div className='text-16 font-medium w-[80%] text-center dark:text-white'>
                    Dashboard
                </div>
                <div className='w-[10%] flex justify-between pr-5 dark:text-white'>
                    <FiPlus className='mt-1'/>
                    <div className='h-7 w-7 rounded-full bg-slate-100 text-center align-middle pt-1 dark:bg-gray-900'>
                        {(auth?.email)?.slice(0,2)}
                    </div>
                </div>
            </div>
            <DrawerComponent
            open={open}
            onClose={onClose}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            />

            <Outlet/>
        </>
    );
};

export default Dashboard;