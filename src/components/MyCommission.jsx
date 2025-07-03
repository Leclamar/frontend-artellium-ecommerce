import Link from 'next/link'

const MyCommission = () => {
    return(
        <>
            <main className='justify-self-center flex items-stretch p-5 rounded-md max-w-max shadow-md'>
                <div className='w-40'>
                    <img className=' rounded-sm object-cover aspect-square'
                        src="/dummy-img/yeonjun-txt.jpeg"
                        alt="artwork-image">
                    </img>
                </div>
                
                <section className='self-start text-start ml-4 min-w-70 max-w-70'>
                    <header>
                        <h1 className='text-xl'>Description</h1>
                        <h3 className='font-light'>Artist's username</h3>
                    </header>


                    <div className=' text-sky-500 text-sm flex font-bold mt-4 mb-2'>
                        <label>Price:</label>
                        <div className='ml-1'>IDR<span>4,000,000</span></div>
                    </div>

                    <div className=' text-sky-500 text-sm flex font-bold'>
                        <label>Slots:</label>
                        <div className='ml-1'>3</div>
                    </div>
                </section>

                <div className='flex flex-col justify-between text-xs'>
                    <time className='opacity-30'><span>06/08/2020</span> - <span>06/09/2028</span></time>
                    <button className='border btn-dark-blue flex py-2 px-4 self-end'>
                        <svg className='size-5 mr-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"/></svg>
                        <div>Edit</div>
                    </button>
                </div>
            </main>
        </>
    )
}

export default MyCommission