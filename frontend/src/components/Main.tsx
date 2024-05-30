import React, { useEffect, useState } from 'react';
import folderImage from '../assets/folder.png'
import { FiPlus } from "react-icons/fi";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { url } from '../Constant';
import ModalComponent from './Modal';
import { Link, useNavigate } from 'react-router-dom';
import { message, Spin, Empty, Skeleton } from 'antd';

type ProjectsType = {
    id: string
    name: string
    folder: string
    userId: string
    createdAt: string
}

type ProjectsProps = {
    name: string
    createdAt: string
    loading: boolean
}

const ProjectCard = ({name, createdAt, loading}: ProjectsProps) => {
    return (
        <>
        { !loading ?
        <Link to={`/dashboard/${name}`}
        className='dark:text-white dark:hover:bg-gray-900 hover:bg-rare rounded-xl flex flex-col justify-start items-center pt-5 w-[400px] h-[300px]'>
            <div className='flex justify-center gap-3 items-center'>
                <div className='font-semibold text-lg'>
                    {name}
                </div>
                <div className='font-medium text-[14px]'>
                    {createdAt}
                </div>
            </div>
            <img src={folderImage} className='h-[250px] w-[300px]'/>
        </Link>
        :<div className='w-[400px] h-[300px]'>
            <Skeleton.Node 
            active
            className='pt-[25%]'/>
        </div>
        }
        </>
    )
}

const Main = () => {

    const authHeader = useAuthHeader()
    const [projects, setProject] = useState<[ProjectsType] | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [loadingProjects, setLoadingProjects] = useState(false)

    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const success = (msg: string) => {
        messageApi.open({
        type: 'success',
        content: msg,
        });
    };

    const error = (msg: string) => {
        messageApi.open({
        type: 'error',
        content: msg,
        });
    };

    useEffect(() => {
        async function runFetchAllProject () {
            setLoadingProjects(true)
            await fetchAllProject()
            setLoadingProjects(false)
        }
        runFetchAllProject()
    },[])

    async function fetchAllProject () {
        const response = await fetch(`${url}/api/project/`,{
            method: 'get',
            headers:{'content-type': 'application/json',
                'authorization': authHeader as string},
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
        })
        const res = await response.json()
        if (response.ok) {
            setProject(res)
        }
    }

    async function createProject (name: string, language: string) {
        setLoading(true)
        try {
            const response = await fetch(`${url}/api/project/project/`,{
                method: 'post',
                headers:{'content-type': 'application/json',
                    'authorization': authHeader as string},
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                body: JSON.stringify({
                    name: name,
                    language
                })
            })
            const res = await response.json()
            if (response.ok) {
                success(res)
                navigate(`/dashboard/${name}`)
            } else {
                error(res)
            }
        } catch (err) {
            error('something went wrong, try again!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        {contextHolder}
        { ! loading ? 
            <div className='dark:bg-primary h-[100vh] w-full dark:text-white py-20 px-10 flex flex-col'>
                <h1 className='font-bold text-3xl'>
                    Home
                </h1>
                <p className='font-bold text-xl'>
                    Recent Project
                </p>
                <div>
                    {   projects?.length < 1 ?
                        <Empty description={false} />:
                        <div>
                        {
                            projects?.map((project: ProjectsType, index: number) => (
                            <ProjectCard
                            {...project}
                            key={index}
                            loading={loadingProjects}/>
                            ))
                        }
                        </div>
                    }
                </div>
                <button className='flex justify-center gap-2 w-[150px] py-2 rounded-md bg-secondary text-gray-300 mt-5'
                onClick={showModal}>
                    <FiPlus/>
                    Create Project
                </button>
                <ModalComponent
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                createProject={createProject}/>
            </div> :
            <div className='flex justify-center h-[100vh] w-full dark:bg-primary'>
                <Spin className='pt-[48vh]'/>
            </div>
        }
        </>
    );
};

export default Main;