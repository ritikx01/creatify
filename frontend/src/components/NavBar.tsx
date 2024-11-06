import Logo from "@/assets/svgComponents/logo";
import ToggleDarkMode from "@/components/ToggleDarkMode";
import { Link } from "react-router-dom";
import AccountPopover from "./AccountPopover";

export interface Paths {
  pathName: string,
  relativePath: string,
  highlight? : boolean
}

function NavBar({paths}: {paths?:Paths[]}): JSX.Element {
  const allPaths = paths ? paths.map(path => (
    <Link
      key={path.relativePath}
      to={path.relativePath}
      className={path.highlight ? 'dark:bg-primaryDark bg-primaryLight dark:hover:bg-primaryDarkHover hover:bg-primaryLightHover rounded-md px-3 py-1' : ''}>
      {path.pathName}
    </Link>
  )) : null
  return(
    <div>
      <div className="fixed inset-x-0 z-10 w-full">
        <nav className="bg-white/30 dark:bg-transparent backdrop-blur-md shadow-md dark:shadow-gray-900/90">
          <div className="px-6 py-2">
            <div className="flex justify-between items-center h-10 text-lg">
              <div className="h-full">
                <Link to={"/"}>
                <Logo />
                </Link>
              </div>
              <div className="flex gap-5 text-xl items-center font-semibold">
                {allPaths}
                <AccountPopover />
                <ToggleDarkMode />
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className="h-16" />
    </div>
  )
}

export default NavBar;
