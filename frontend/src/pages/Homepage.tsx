import { SiFastapi } from "react-icons/si";
import { BsGlobeEuropeAfrica } from "react-icons/bs";
import logo from '/backend.png'
import SignIn from "../components/SignIn";
import { useState } from "react";
import SignUp from "../components/SignUp"

export default function HomePage () {
    const [formType, setFormType] = useState('signin')
    return (
        <div className="flex justify-center h-screen">
            <div className="w-[50%] bg-primary h-full text-white">
                <div className="flex item-center gap-2">
                    <img src={logo} className="w-10 h-10"/>
                    <h1 className="text-3xl font-bold text-blue-300">
                        goDev
                    </h1>
                </div>
                <h1 className="text-5xl font-bold mt-[30vh] text-center">
                    Build Faster, On The Go
                </h1>
                <div className="flex gap-5 justify-center items-center text-gray-300 mt-10">
                    <div className="flex">
                        <SiFastapi/>
                        <p>
                            Boost productivity with goDev
                        </p>
                    </div>
                    <div className="flex">
                        <BsGlobeEuropeAfrica/>
                        <p>
                            Join a community of world class developers
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-[50%] ">
                <div className="mt-[10vh] pr-20">
                    {
                        formType == 'signin' ?
                        <SignIn setFormType={setFormType}/> :
                        <SignUp setFormType={setFormType}/>
                    }
                </div>
            </div>
        </div>
    )
}