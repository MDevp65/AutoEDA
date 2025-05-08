
import React from 'react'

const Header = () => {
    return (
        <>

            <div className="flex items-center justify-around bg-gradient-to-br from-slate-900 to-slate-800 ">
                <div className="ml-10">
                    <img className="h-fit w-fit p-2 rounded-xl" src={"/banner.png"} alt="AutoEDA" />
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 my-3">
                        AutoEDA - Analyze your CSV Data here.
                    </h1>
                    <p className=" text-center text-gray-300">Upload your CSV file and get quick analysis of your data. You just have to uplaod the file and click the analyze button, then after anlysis the download button will appear, by clicking this, you can easily get analysis file.</p>
                </div>
            </div>

        </>
    )
}

export default Header
