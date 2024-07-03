'use client'
import useClickOutside from '@/hooks/useClickOutside'
import { FetchApi } from '@/utility/FetchApi'
import { getTimeFromDuration } from '@/utility/functions'
import { jwtDecode } from 'jwt-decode'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const Page = () => {
    const [selectedCategory, setSelectedCategory] = useState("RIDE")
    const [skins, setskins] = useState([])
    const [selectedSkin, setselectedSkin] = useState({})
    const [selectedPrice, setselectedPrice] = useState({})
    const [buySkinPopup, setbuySkinPopup] = useState(false)
    const [skinPreview, setskinPreview] = useState(false)
    const query = useSearchParams()
    const { user: jwtUser, exp } = jwtDecode(query.get('token'))
    if(!jwtUser){
        return <></>
    }
    const [user, setuser] = useState(jwtUser)
    const refetchAuth =async () => {
        const res = await FetchApi({
            url: `/user/getUserById/${jwtUser?._id}`, callback: () => {
            }
        })
        console.log(user, res.data)
        setuser(res.data.user)
    }
    useEffect(() => {
        const loadData = async () => {
            refetchAuth()
            const { data } = await FetchApi({ url: 'skin' })
            setskins(data.result)
        }
        loadData()
    }, [])
    const filteredSkins = skins.filter(sk => sk.type === selectedCategory)
    const ref = useRef()
    const previewRef = useRef()
    useClickOutside(ref, () => {
        setbuySkinPopup(false)
        if (selectedSkin.fileType.includes('video')) {

            previewRef.current.pause()
        }
    })
    useClickOutside(previewRef, () => {
        setskinPreview(false)
    })
    const handleBuySkin = async () => {
        const currentTime = Date.now() / 1000;
        if (exp < currentTime) {
            return toast.error("Token is expired")
        }
        if (!selectedPrice.time) {
            return toast.error("Please select a time")
        }
        if (!user) {
            return toast.error("User not found")
        }
        const data = {
            user: user.maxId,
            skinId: selectedSkin._id,
            expiresIn: selectedPrice.time
        }
        try {
            await FetchApi({ url: 'skin/buy-skin', method: 'post', data, isToast: true, callback: refetchAuth})

        } catch (error) {

        }
    }
    return (
        <div className='overflow-hidden relative max-w-[500px] mx-auto'>
            <div >
                <div className='bg-white relative max-w-[500px] px-5 pt-7 w-full h-screen mx-auto'>
                    <div className='flex justify-between'>
                        <p className='text-black text-xl'>Store</p>
                        <p className='text-end'>Beans: {user?.beans}</p>
                    </div>
                    <div className=''>
                        <div className='flex gap-2 mx-auto justify-center mt-5 border-[2px] rounded-lg border-primary p-1 w-max text-sm'>
                            <p className={`px-5 py-2 rounded-lg cursor-pointer  ${selectedCategory === 'RIDE' ? 'bg-primary text-white' : 'text-primary'}`} onClick={() => setSelectedCategory('RIDE')}>Ride</p>
                            <p className={`px-5 py-2 rounded-lg  cursor-pointer ${selectedCategory === 'FRAME' ? 'bg-primary text-white' : 'text-primary'}`} onClick={() => setSelectedCategory('FRAME')}>Frame</p>
                            <p className={`px-5 py-2 rounded-lg cursor-pointer  ${selectedCategory === 'ENTRY' ? 'bg-primary text-white' : 'text-primary'}`} onClick={() => setSelectedCategory('ENTRY')}>Entry</p>
                        </div>
                    </div>
                    <div className='mt-3 grid grid-cols-2 gap-1' >
                        {
                            filteredSkins?.map((skin, i) => <div key={i} className='rounded-lg border border-primary' onClick={() => setselectedSkin(skin)}>
                                <div className='w-32 h-32 mx-auto my-2 relative' onClick={() => {
                                    setskinPreview(true)
                                    if (previewRef.current && typeof previewRef.current.play === 'function') {
                                        previewRef?.current?.play()
                                    }
                                }}>
                                    {
                                        skin?.fileType?.includes('video') ? <video src={skin.file} muted className=' object-cover w-32 h-32'></video> :
                                            <img src={skin.file} alt='' className='object-cover w-32 h-32' />
                                    }
                                    {
                                        skin?.fileType?.includes('video') && <div>
                                            <svg
                                                className='absolute top-10 left-10 cursor-pointer'
                                                id="SvgjsSvg1026"
                                                width="50"
                                                height="50"
                                                xmlns="http://www.w3.org/2000/svg"
                                                version="1.1"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                xmlnsSvgjs="http://svgjs.com/svgjs"
                                            >
                                                <defs id="SvgjsDefs1027"></defs>
                                                <g id="SvgjsG1028">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="50" height="50">
                                                        <path
                                                            fill="#c1c1c1"
                                                            fillRule="evenodd"
                                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                                            clipRule="evenodd"
                                                            className="colorAAA svgShape"
                                                            opacity="0.5"
                                                        ></path>
                                                        <path
                                                            fill="#111111"
                                                            d="M15.4137 13.059L10.6935 15.8458C9.93371 16.2944 9 15.7105 9 14.7868V9.21316C9 8.28947 9.93371 7.70561 10.6935 8.15419L15.4137 10.941C16.1954 11.4026 16.1954 12.5974 15.4137 13.059Z"
                                                            className="color111 svgShape"
                                                        ></path>
                                                    </svg>
                                                </g>
                                            </svg>
                                        </div>
                                    }
                                </div>
                                <div className='cursor-pointer' onClick={() => {
                                    setbuySkinPopup(true)
                                }}>
                                    <p className='text-black text-sm text-center mt-1'>{skin.name}</p>
                                    <p className='text-grayColor text-xs text-center mb-1'><span className='text-[#5C2D95] font-semibold'>{skin.beans.find(b => b.time === '168:00:00.000000').value}</span> beans/week</p>

                                </div>
                            </div>
                            )
                        }
                    </div>
                    {
                        filteredSkins.length === 0 && <p className='text-center mt-10'>0 {selectedCategory} FOUND</p>
                    }
                </div>
                <div ref={ref} className={`max-w-[500px] w-full mx-auto  absolute bottom-0 border shadow-slate-950 shadow-xl rounded-t-2xl ${buySkinPopup ? 'bottom-0' : '-bottom-[500px]'} duration-300`}>
                    <div className={`${buySkinPopup ? 'block p-5' : 'hidden'}`}>
                        <div className='w-32 h-32 mx-auto  -mt-20 rounded-full outline outline-primary'>
                            {
                                selectedSkin?.fileType?.includes('video') ? <video src={selectedSkin?.file} autoPlay={true} muted={true} loop className=' rounded-full object-cover w-32 h-32'></video> :
                                    <img src={selectedSkin?.file} alt='' className='rounded-full object-cover w-32 h-32' />
                            }
                        </div>
                        <p className='text-black text-center'>{selectedSkin?.name}</p>
                        <p className='text-black text-center text-xs'>#{selectedSkin?._id}</p>
                        <p className='text-sm mt-4'>Lease Period</p>
                        <div className='flex gap-2 overflow-x-scroll mt-1'>
                            {
                                selectedSkin?.beans?.map((item, i) => <button key={i} className={`border rounded-lg px-5 py-2 ${selectedPrice.time === item.time && 'bg-primary text-white'}`} onClick={() => setselectedPrice(item)}>
                                    {getTimeFromDuration(item.time)}
                                </button>)
                            }
                        </div>
                        <p className='text-sm my-2'>Price: <span className='font-semibold'>{selectedPrice?.value}</span> beans</p>
                        <button className='w-full bg-primary rounded-lg text-white py-2' onClick={handleBuySkin}>Buy Now</button>
                    </div>

                </div>
                <div className={`absolute duration-300 w-full ${!skinPreview ? '-top-[1000px]' : 'top-0'}`}>
                    <div className='h-screen flex items-center bg-black bg-opacity-30 w-full'>
                        {
                            selectedSkin?.fileType?.includes('video') ? <video ref={previewRef} src={selectedSkin?.file} autoPlay={true} loop className=' '></video> :
                                <Image ref={previewRef} src={selectedSkin?.file} alt='' width={500} height={500} className='w-full' />
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

// export default Page


const SuspendedStorePage = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <Page />
    </Suspense>
);

export default SuspendedStorePage;