import {ReactNode} from 'react';

export const SideBar = ({children}: { children: ReactNode }) => {
    return (
        <aside className='w-[250px] h-[100vh] border-r-[2px] border-[#242424] pt-[3px]'>
            {children}
        </aside>
    )
}

export default SideBar