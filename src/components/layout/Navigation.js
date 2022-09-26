import { useDispatch, useSelector } from "react-redux";
import { NavLink, useMatch } from "react-router-dom";
import logoImage from "../../assets/images/lws-logo-light.svg";
import { userLoggedOut } from "../../features/auth/authSlice";

export default function Navigation() {
    const {user} = useSelector((state) => state.auth) || {};
    const {id: userId, email} = user || {};
    const dispatch = useDispatch();
    const match = useMatch("/projects");

    const logout = () => {
        dispatch(userLoggedOut());
        localStorage.clear();
    };
    return (
        <div className="flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75">
            <img
                className="h-10"
                src={logoImage}
                alt="Learn with Sumit"
            />
            { 
                match && <input
                    className="flex items-center h-10 px-4 ml-10 text-sm bg-gray-200 rounded-full focus:outline-none focus:ring"
                    type="search"
                    placeholder="Search for anything…"
                />
            }
            <div className="ml-10">
                <NavLink 
                    to="/projects" 
                    className="mx-2 text-sm font-semibold text-gray-600 hover:text-indigo-700"
                    style={({ isActive }) => {
                        return {
                          color: isActive ? "rgb(67 56 202 / var(--tw-text-opacity))" : "",
                        };
                    }}          
                >
                    Projects
                </NavLink>
                <NavLink 
                    to="/teams" 
                    className="mx-2 text-sm font-semibold text-gray-600 hover:text-indigo-700"
                    style={({ isActive }) => {
                        return {
                          color: isActive ? "rgb(67 56 202 / var(--tw-text-opacity))" : "",
                        };
                    }}
                >
                    Teams
                </NavLink>
            </div>
            <buton
                className="flex items-center justify-center w-8 h-8 ml-auto overflow-hidden rounded-full cursor-pointer"
            >
                <img
                    src={`https://randomuser.me/api/portraits/men/${userId}.jpg`}
                    alt="avatar"
                />
            </buton>
            <div className="flex justify-center">
                <div>
                    <div className="dropdown relative">
                        <button
                            className="dropdown-toggle flex items-center justify-center w-full inline-block px-1 text-blue-600 font-medium text-xs uppercase rounded focus:ring-0"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {email}
                            <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="caret-down"
                                className="w-2 ml-2"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                                ></path>
                            </svg>
                        </button>
                        <ul
                            className="dropdown-menu min-w-max absolute hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none"
                            aria-labelledby="dropdownMenuButton1"
                        >
                            <li>
                                <span
                                    className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={logout}
                                >
                                    Logout
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                </div>
        </div>
    );
}
