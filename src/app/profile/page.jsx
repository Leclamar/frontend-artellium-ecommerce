import Link from "next/link"
import Navbar from "../../components/Navbar"

const Profile = () => {
    return(
        <>
        <Navbar />
        
        <article className="flex items-start">
            <section className="min-w-1/2 px-4 mt-8">
                <header className="text-3xl mb-4 flex">
                    <button className="w-max h-max border rounded-full place-items-center">
                        <svg className="size-15 p-3" xmlns="http://www.w3.org/2000/svg"viewBox="0 0 12 24"><path fill="currentColor" fill-rule="evenodd" d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"/></svg>
                    </button>
                    <h1 className="mx-5">User's Profile</h1></header>

                <div className="size-50 place-self-center bg-amber-400 rounded-full mx-10 my-8">

                </div>

                <ul className="">
                    <li className="cursor-pointer p-2">Edit Profile</li>
                    <li className="cursor-pointer p-2">Change Password</li>
                    <li className="cursor-pointer p-2">Log out</li>
                </ul>
            </section>

            <section className="w-full border-l h-screen">

            </section>
        </article>
        </>
    )
}

export default Profile