import {ReactNode} from 'react';

export const SideBar = ({children}: { children: ReactNode }) => {
    return (
        <aside className='w-[40%] h-[100vh] text-[12px] border-r-[1px] border-[#242424]'>
            {children}
        </aside>
    )
}

export default SideBar