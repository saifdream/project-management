import Footer from "./footer";
import Navigation from "./Navigation";

export default function Layout({children}) {
    return (
        <>
            <div className="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
                <Navigation/>
                { children }
            </div>
            <Footer/>
        </>
    )
}