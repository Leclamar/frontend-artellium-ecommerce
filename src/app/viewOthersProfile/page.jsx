import Navbar from "../../components/Navbar"
import MyCommission from "../../components/MyCommission"
import Link from "next/link"
import Artwork from "../../components/Artwork"

const ViewProfile = () => {
    return(
        <>
            <Navbar />

            <article className="mt-3">
                <section className="flex">
                    <div className="size-50 max-w-50 bg-amber-200 rounded-full grow"></div>
                    <div className="max-w-1/2 ml-10">
                        <h2 className="font-bold text-4xl my-2">Username</h2>
                        <div className="text-sm">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et</div>
                        <span className="text-xs mt-2 opacity-20 font-bold">Member since <time>09/09/2009</time></span>
                    </div>
                </section>
            </article>
            <article>
                <div className="h-0 border opacity-20 my-10"></div>
                <h2 className="text-center font-bold text-2xl mb-10"><span>User</span> Commissions</h2>
                <MyCommission />
            </article>

            <article>
                <div className="h-0 border opacity-20 my-10"></div>
                <h2 className="text-center font-bold text-2xl mb-10"><span>User</span> Artworks</h2>
                <section className="items">
                    <Artwork />
                    <Artwork />
                    <Artwork />
                </section>
                
            </article>
        </>
    )
}

export default ViewProfile