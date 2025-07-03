import Link from "next/link"
import Navbar from "../../components/Navbar"
import Commission from "../../components/Commission"

const Search = () => {
    return(
        <>
            <Navbar />
            <article className="mb-8">
                <header className="my-14 text-4xl text-center">
                    Dummy Search Result
                </header>

                <section>
                    <div className="border h-0 opacity-25 w-full mb-8"></div>
                    
                    <section className="items">
                        <Commission />
                        <Commission />
                        <Commission />
                        <Commission />
                        <Commission />
                        <Commission />
                        <Commission />
                    </section>
                </section>
            </article>
        </>
    )
}

export default Search